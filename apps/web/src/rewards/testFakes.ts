import { RewardDeliveryError } from './RewardDeliveryError';
import type {
  HabiticaDays,
  InstallationStatus,
  LinkedUser,
  RecipientRewards,
  RewardableEvent,
  RewardDirectory,
  RewardLog,
  RewardSink,
  TriggerCaps,
  TriggerCooldowns,
  TriggerRule,
} from './types';

/*
 * In-memory adapters for the Reward Policy's dependencies, shared by the
 * tests of everything that delivers rewards.
 */

export const INSTALLATION_ID = 100;
export const REPOSITORY_ID = 200;

const SELECTED_INSTALLATION: InstallationStatus = {
  isRepositorySelected: true,
  isSuspended: false,
};

export const makeTrigger = (
  overrides: Partial<TriggerRule> = {},
): TriggerRule => ({
  cooldownSeconds: null,
  dailyCap: null,
  event: 'push',
  isActive: true,
  lastScoredAt: null,
  repositoryIds: [REPOSITORY_ID],
  scoreDirection: 'up',
  skipSpam: true,
  taskAlias: null,
  taskAttribute: 'str',
  taskFrequency: 'daily',
  taskNote: null,
  taskPriority: 1,
  taskTitle: 'Write code',
  uuid: 'trigger-1',
  ...overrides,
});

export const makeUser = (overrides: Partial<LinkedUser> = {}): LinkedUser => ({
  credentials: { apiToken: 'habitica-token', userId: 'habitica-user' },
  githubId: 42,
  id: BigInt(1),
  installationIds: [INSTALLATION_ID],
  login: 'octocat',
  triggers: [makeTrigger()],
  ...overrides,
});

export const makeEvent = (
  overrides: Partial<RewardableEvent> = {},
): RewardableEvent => ({
  contributions: [{ actor: { login: 'octocat' }, count: 1, spamCount: 0 }],
  delivery: { hookId: 'hook-1', id: 'delivery-1', signature: 'sha256=abc' },
  installationId: INSTALLATION_ID,
  name: 'push',
  repositoryId: REPOSITORY_ID,
  ...overrides,
});

export const inMemoryDirectory = (
  users: LinkedUser[],
  status: InstallationStatus | null = SELECTED_INSTALLATION,
): RewardDirectory => ({
  findLinkedUsers: async actors =>
    users.filter(user =>
      actors.some(actor =>
        'githubId' in actor
          ? actor.githubId === user.githubId
          : actor.login === user.login,
      ),
    ),
  getInstallationStatus: async () => status,
});

export const recordingSink = () => {
  const applied: RecipientRewards[] = [];
  const sink: RewardSink = {
    apply: async recipientRewards => {
      applied.push(recipientRewards);

      return Object.fromEntries(
        recipientRewards.rewards.map(({ times, triggerUuid }) => [
          triggerUuid,
          times,
        ]),
      );
    },
  };

  return { applied, sink };
};

export const recordingLog = () => {
  const recorded: { delivery: string; event: string; login: string }[] = [];
  const log: RewardLog = {
    claim: async (event, recipient) => {
      const isClaimed = recorded.some(
        entry =>
          entry.delivery === event.delivery.id &&
          entry.login === recipient.login,
      );

      if (isClaimed) {
        return false;
      }

      recorded.push({
        delivery: event.delivery.id,
        event: event.name,
        login: recipient.login,
      });

      return true;
    },
    release: async (event, recipient) => {
      const index = recorded.findIndex(
        entry =>
          entry.delivery === event.delivery.id &&
          entry.login === recipient.login,
      );

      recorded.splice(index, 1);
    },
  };

  return { log, recorded };
};

export const failingSink = (isRetryable = true): RewardSink => ({
  apply: async () => {
    throw new RewardDeliveryError([new Error('Habitica said no')], isRetryable);
  },
});

// Triggers without a cooldown never claim one
export const noCooldowns: TriggerCooldowns = {
  claim: async () => {
    throw new Error('Only triggers with a cooldown are claimed.');
  },
  release: async () => {
    throw new Error('Only triggers with a cooldown are released.');
  },
};

/** Compare-and-sets `lastScoredAt` on the users' own trigger objects. */
export const inMemoryCooldowns = (users: LinkedUser[]) => {
  const released: string[] = [];
  const findTrigger = (uuid: string) =>
    users.flatMap(({ triggers }) => triggers).find(t => t.uuid === uuid);

  const cooldowns: TriggerCooldowns = {
    claim: async (uuid, previousScoredAt, now) => {
      const trigger = findTrigger(uuid);

      if (
        !trigger ||
        trigger.lastScoredAt?.getTime() !== previousScoredAt?.getTime()
      ) {
        return false;
      }

      trigger.lastScoredAt = now;

      return true;
    },
    release: async (uuid, claimedAt, previousScoredAt) => {
      released.push(uuid);

      const trigger = findTrigger(uuid);

      if (trigger?.lastScoredAt?.getTime() === claimedAt.getTime()) {
        trigger.lastScoredAt = previousScoredAt;
      }
    },
  };

  return { cooldowns, released };
};

// Triggers without a daily cap never look up the day or claim a cap
export const noCaps: TriggerCaps = {
  claim: async () => {
    throw new Error('Only triggers with a daily cap are claimed.');
  },
  release: async () => {
    throw new Error('Only triggers with a daily cap are released.');
  },
};

export const noDays: HabiticaDays = {
  today: async () => {
    throw new Error('Only triggers with a daily cap need the Habitica day.');
  },
};

/** Counts scores per trigger and day, against the users' own `dailyCap`. */
export const inMemoryCaps = (users: LinkedUser[]) => {
  const counts = new Map<string, { count: number; day: string }>();
  const released: { count: number; uuid: string }[] = [];
  const findCap = (uuid: string) =>
    users.flatMap(({ triggers }) => triggers).find(t => t.uuid === uuid)
      ?.dailyCap ?? null;

  const caps: TriggerCaps = {
    claim: async (uuid, day, wanted) => {
      const cap = findCap(uuid);
      const current = counts.get(uuid);
      const used = current?.day === day ? current.count : 0;
      const granted =
        cap === null ? wanted : Math.max(0, Math.min(wanted, cap - used));

      if (granted > 0) {
        counts.set(uuid, { count: used + granted, day });
      }

      return granted;
    },
    release: async (uuid, day, count) => {
      released.push({ count, uuid });

      const current = counts.get(uuid);

      if (current?.day === day && current.count >= count) {
        counts.set(uuid, { count: current.count - count, day });
      }
    },
  };

  return { caps, released };
};

/** A Habitica day that tests can move forward, counting lookups. */
export const settableDays = (initialDay: string) => {
  const state = { day: initialDay, lookups: 0 };
  const days: HabiticaDays = {
    today: async () => {
      state.lookups++;

      return state.day;
    },
  };

  return { days, state };
};
