import {
  failingSink,
  fakeRewardDeps,
  INSTALLATION_ID,
  makeTrigger,
  makeUser,
  REPOSITORY_ID,
} from '@/rewards/testFakes';
import type { LinkedUser, RewardSink } from '@/rewards/types';

import { dispatchWebhook } from './dispatchWebhook';

jest.mock('@/accessors/githubInstallation', () => ({}));
jest.mock('@/accessors/marketplaceEvent', () => ({}));
jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: { error: jest.fn(), info: jest.fn(), warn: jest.fn() },
}));

const delivery = {
  hookId: 'hook-1',
  id: 'delivery-1',
  signature: 'sha256=abc',
};

const installation = { id: INSTALLATION_ID };
const repository = { id: REPOSITORY_ID };

const pullRequestClosed = {
  action: 'closed',
  installation,
  pull_request: {
    closed_at: '2026-10-24T12:00:00Z',
    created_at: '2026-10-20T12:00:00Z',
    user: { id: 42 },
  },
  repository,
  sender: { id: 42 },
};

const push = {
  commits: [
    {
      added: [],
      author: { username: 'octocat' },
      distinct: true,
      modified: ['a.ts'],
      removed: [],
    },
  ],
  installation,
  repository,
};

/** Dispatches a delivery to users who are linked, recording what they got. */
const dispatchTo = (
  users: LinkedUser[],
  name: string,
  payload: unknown,
  sink?: RewardSink,
) => {
  const { applied, deps, recorded } = fakeRewardDeps(users, sink);
  const dispatched = dispatchWebhook(
    { delivery, name, payload },
    { rewards: deps },
  );

  return { applied, dispatched, recorded };
};

describe('dispatchWebhook', () => {
  it('rewards an event under its full name', async () => {
    const user = makeUser({
      githubId: 42,
      triggers: [makeTrigger({ event: 'pull_request.closed' })],
    });
    const { applied, dispatched, recorded } = dispatchTo(
      [user],
      'pull_request',
      pullRequestClosed,
    );

    await dispatched;

    expect(applied).toHaveLength(1);
    expect(recorded).toEqual([
      {
        delivery: 'delivery-1',
        event: 'pull_request.closed',
        login: 'octocat',
      },
    ]);
  });

  it("reaches an event without an action by GitHub's name", async () => {
    const { applied, dispatched, recorded } = dispatchTo(
      [makeUser()],
      'push',
      push,
    );

    await dispatched;

    expect(applied[0].rewards).toMatchObject([{ times: 1 }]);
    expect(recorded).toEqual([
      { delivery: 'delivery-1', event: 'push', login: 'octocat' },
    ]);
  });

  it.each([
    ['ping', { zen: 'Keep it logically awesome.' }],
    ['pull_request', { ...pullRequestClosed, action: 'milestoned' }],
  ])('skips %s, which Octogriffin does not handle', async (name, payload) => {
    const { applied, dispatched, recorded } = dispatchTo(
      [makeUser({ githubId: 42 })],
      name,
      payload,
    );

    await expect(dispatched).resolves.toBeUndefined();
    expect(applied).toEqual([]);
    expect(recorded).toEqual([]);
  });

  it('fails when the handler fails, so the delivery can be retried', async () => {
    const { dispatched } = dispatchTo(
      [makeUser()],
      'push',
      push,
      failingSink(),
    );

    await expect(dispatched).rejects.toThrow(
      'Some rewards could not be delivered.',
    );
  });
});
