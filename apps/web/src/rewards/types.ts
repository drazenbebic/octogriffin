import { TaskAttribute, TaskDirection, TaskFrequency } from '@/enums/habitica';
import { UserCredentials } from '@/types/habitica';

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
  id: string;
  signature: string;
  hookId: string;
};

/**
 * A GitHub event, normalised to what the Reward Policy needs to know.
 */
export type RewardableEvent = {
  delivery: Delivery;
  /** Full event name as stored on triggers, e.g. `push` or `pull_request.closed`. */
  name: string;
  installationId: number;
  repositoryId: number;
  contributions: Contribution[];
};

export type Recipient = {
  githubUserId: bigint;
  login: string;
  credentials: UserCredentials;
};

export type HabiticaTask = {
  title: string;
  alias?: string;
  note?: string;
  priority: number;
  attribute: TaskAttribute;
  frequency: TaskFrequency;
};

export type Reward = {
  triggerUuid: string;
  task: HabiticaTask;
  direction: TaskDirection;
  times: number;
};

export type RecipientRewards = {
  recipient: Recipient;
  rewards: Reward[];
};

export type TriggerRule = {
  uuid: string;
  event: string;
  isActive: boolean;
  repositoryIds: number[];
  taskTitle: string;
  taskAlias: null | string;
  taskNote: null | string;
  taskPriority: number;
  taskAttribute: string;
  taskFrequency: string;
  scoreDirection: string;
};

/**
 * A GitHub user with a linked Habitica account, and all of their triggers.
 */
export type LinkedUser = {
  id: bigint;
  githubId: number;
  login: string;
  installationId: number;
  credentials: UserCredentials;
  triggers: TriggerRule[];
};

export type InstallationStatus = {
  isSuspended: boolean;
  isRepositorySelected: boolean;
};

/**
 * Where the Reward Policy looks things up.
 */
export type RewardDirectory = {
  getInstallationStatus: (
    installationId: number,
    repositoryId: number,
  ) => Promise<InstallationStatus | null>;
  findLinkedUsers: (actors: Actor[]) => Promise<LinkedUser[]>;
};

/**
 * Where Rewards end up: a recipient's Habitica account.
 */
export type RewardSink = {
  apply: (recipientRewards: RecipientRewards) => Promise<void>;
};

/**
 * The history of rewarded events each user sees on their dashboard. Each
 * delivery can be claimed once per recipient, so a redelivered or retried
 * event is never rewarded twice.
 */
export type RewardLog = {
  /** Resolves to `false` when the recipient was already rewarded for this delivery. */
  claim: (event: RewardableEvent, recipient: Recipient) => Promise<boolean>;
};
