import { isEmptyCommit, isQuickSelfClose, spamRules } from './spam';

const opened = '2026-10-24T10:00:00Z';

const pullRequest = (closedAfterSeconds: null | number, authorId = 1) => ({
  closed_at:
    closedAfterSeconds === null
      ? null
      : new Date(Date.parse(opened) + closedAfterSeconds * 1000).toISOString(),
  created_at: opened,
  user: { id: authorId },
});

describe('isEmptyCommit', () => {
  it('treats a commit that changes nothing as empty', () => {
    expect(isEmptyCommit({ added: [], modified: [], removed: [] })).toBe(true);
  });

  it('counts a commit that changes a file', () => {
    expect(isEmptyCommit({ added: [], modified: ['a.ts'], removed: [] })).toBe(
      false,
    );
  });

  it('counts a merge commit made with the merge button', () => {
    expect(
      isEmptyCommit({
        added: [],
        message: 'Merge pull request #12 from octocat/feature',
        modified: [],
        removed: [],
      }),
    ).toBe(false);
  });

  it('counts a merge commit made by git pull', () => {
    expect(
      isEmptyCommit({
        added: [],
        message: "Merge branch 'main' of github.com:octocat/hello-world",
        modified: [],
        removed: [],
      }),
    ).toBe(false);
  });

  it('counts a merge of a remote-tracking branch', () => {
    expect(
      isEmptyCommit({
        added: [],
        message: "Merge remote-tracking branch 'origin/main'",
        modified: [],
        removed: [],
      }),
    ).toBe(false);
  });

  it('treats an empty commit that only mentions a merge as empty', () => {
    expect(
      isEmptyCommit({
        added: [],
        message: 'chore: retrigger CI after the merge',
        modified: [],
        removed: [],
      }),
    ).toBe(true);
  });

  it('counts a commit whose file lists are missing', () => {
    expect(isEmptyCommit({ added: [], removed: [] })).toBe(false);
  });
});

describe('isQuickSelfClose', () => {
  it('flags a pull request its author closed within a minute', () => {
    expect(isQuickSelfClose(pullRequest(59), 1)).toBe(true);
  });

  it('counts a pull request closed after exactly a minute', () => {
    expect(isQuickSelfClose(pullRequest(60), 1)).toBe(false);
  });

  it('counts a pull request someone else closed quickly', () => {
    expect(isQuickSelfClose(pullRequest(5, 2), 1)).toBe(false);
  });

  it('counts a pull request without a closing time', () => {
    expect(isQuickSelfClose(pullRequest(null), 1)).toBe(false);
  });

  it('counts a pull request whose author account is gone', () => {
    expect(isQuickSelfClose({ ...pullRequest(5), user: null }, 1)).toBe(false);
  });
});

describe('spamRules', () => {
  it('has a rule for pushes and closed pull requests only', () => {
    expect(Object.keys(spamRules).sort()).toEqual([
      'pull_request.closed',
      'push',
    ]);
  });
});
