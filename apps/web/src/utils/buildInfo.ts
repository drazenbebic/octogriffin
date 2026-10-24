/** A commit hash shortened to the usual 7 characters, as GitHub shows it. */
export const shortCommit = (sha: string | undefined): string | undefined =>
  sha ? sha.slice(0, 7) : undefined;
