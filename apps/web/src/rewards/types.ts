import type {
  TaskAttribute,
  TaskDirection,
  TaskFrequency,
} from '@/enums/habitica';
import type { UserCredentials } from '@/types/habitica';

/**
 * Someone who did something on GitHub. Commit authors are only known by
 * their login, every other sender by their GitHub ID.
 */
export type Actor = { githubId: number } | { login: string };

export type Contribution = {
  actor: Actor;
  count: number;
};

/**
 * The GitHub webhook delivery an event arrived with.
 */
export type Delivery = {
  hookId: string;
  id: string;
  signature: string;
};

/**
 * A GitHub event, normalised to what the Reward Policy needs to know.
 */
export type RewardableEvent = {
  contributions: Contribution[];
  delivery: Delivery;
  installationId: number;
  /** Full event name as stored on triggers, e.g. `push` or `pull_request.closed`. */
  name: string;
  repositoryId: number;
};

export type Recipient = {
  credentials: UserCredentials;
  githubUserId: bigint;
  login: string;
};

export type HabiticaTask = {
  alias?: string;
  attribute: TaskAttribute;
  frequency: TaskFrequency;
  note?: string;
  priority: number;
  title: string;
};

export type Reward = {
  /** Only for triggers with a cooldown: when it last scored, as it was read. */
  cooldown?: { previousScoredAt: Date | null };
  direction: TaskDirection;
  task: HabiticaTask;
  times: number;
  triggerUuid: string;
};

export type RecipientRewards = {
  recipient: Recipient;
  rewards: Reward[];
};

export type TriggerRule = {
  cooldownSeconds: null | number;
  event: string;
  isActive: boolean;
  lastScoredAt: Date | null;
  repositoryIds: number[];
  scoreDirection: string;
  taskAlias: null | string;
  taskAttribute: string;
  taskFrequency: string;
  taskNote: null | string;
  taskPriority: number;
  taskTitle: string;
  uuid: string;
};

/**
 * A GitHub user with a linked Habitica account, and all of their triggers.
 */
export type LinkedUser = {
  credentials: UserCredentials;
  githubId: number;
  id: bigint;
  installationIds: number[];
  login: string;
  triggers: TriggerRule[];
};

export type InstallationStatus = {
  isRepositorySelected: boolean;
  isSuspended: boolean;
};

/**
 * Where the Reward Policy looks things up.
 */
export type RewardDirectory = {
  findLinkedUsers: (actors: Actor[]) => Promise<LinkedUser[]>;
  getInstallationStatus: (
    installationId: number,
    repositoryId: number,
  ) => Promise<InstallationStatus | null>;
};

/**
 * Where Rewards end up: a recipient's Habitica account.
 */
export type RewardSink = {
  /**
   * Resolves to the triggers that scored at least once. Rejects with a
   * `RewardDeliveryError` when not a single reward could be scored.
   */
  apply: (recipientRewards: RecipientRewards) => Promise<string[]>;
};

/**
 * The history of rewarded events each user sees on their dashboard. Each
 * delivery can be claimed once per recipient, so a redelivered or retried
 * event is never rewarded twice.
 */
export type RewardLog = {
  /** Resolves to `false` when the recipient was already rewarded for this delivery. */
  claim: (event: RewardableEvent, recipient: Recipient) => Promise<boolean>;
  /** Gives up a claim, so the delivery can be rewarded on another try. */
  release: (event: RewardableEvent, recipient: Recipient) => Promise<void>;
};

/**
 * When each trigger with a cooldown last scored. A trigger can only be
 * claimed once per cooldown, even by deliveries arriving at the same time.
 */
export type TriggerCooldowns = {
  /** Resolves to `false` when another delivery claimed the trigger since `previousScoredAt` was read. */
  claim: (
    triggerUuid: string,
    previousScoredAt: Date | null,
    now: Date,
  ) => Promise<boolean>;
  /** Gives up a claim made at `claimedAt`, putting `previousScoredAt` back. */
  release: (
    triggerUuid: string,
    claimedAt: Date,
    previousScoredAt: Date | null,
  ) => Promise<void>;
};
