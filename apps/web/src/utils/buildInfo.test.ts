import { shortCommit } from './buildInfo';

describe('shortCommit', () => {
  it('shortens a full commit hash to the usual 7 characters', () => {
    expect(shortCommit('9328c4a1f2e3d4c5b6a7980716253443f2e1d0c9')).toBe(
      '9328c4a',
    );
  });

  it('returns nothing when the build has no commit', () => {
    expect(shortCommit(undefined)).toBeUndefined();
    expect(shortCommit('')).toBeUndefined();
  });
});
