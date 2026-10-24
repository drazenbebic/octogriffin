const QUICK_CLOSE_MS = 60_000;

// GitHub sends merge commits without file lists, so they're recognised by the
// messages GitHub and git write for them
const MERGE_MESSAGE = /^Merge (pull request #|branch |remote-tracking branch )/;

/** The events with a spam rule, and what the rule leaves out. */
export const spamRules: Partial<Record<string, string>> = {
  'pull_request.closed':
    "Pull requests you close within a minute of opening don't count.",
  push: "Empty commits don't count.",
};

/**
 * A commit that adds, removes and changes nothing. Without its file lists we
 * can't tell, so it counts, and so does a merge.
 */
export const isEmptyCommit = ({
  added,
  message,
  modified,
  removed,
}: {
  added?: string[];
  message?: string;
  modified?: string[];
  removed?: string[];
}) =>
  !MERGE_MESSAGE.test(message ?? '') &&
  !!added &&
  !!modified &&
  !!removed &&
  added.length + modified.length + removed.length === 0;

/** A pull request its own author closed within a minute, merged or not. */
export const isQuickSelfClose = (
  {
    closed_at,
    created_at,
    user,
  }: {
    closed_at?: null | string;
    created_at: string;
    user?: { id: number } | null;
  },
  senderId: number,
) =>
  !!user &&
  !!closed_at &&
  user.id === senderId &&
  Date.parse(closed_at) - Date.parse(created_at) < QUICK_CLOSE_MS;
