import type {
  TaskAttribute,
  TaskFrequency,
  TaskPriority,
  TaskType,
} from '@/enums/habitica';

export type ChecklistItem = {
  completed?: boolean;
  text: string;
};

export type Task = {
  _id: string;
  alias: string;
  attribute: TaskAttribute;
  challenge: {
    id: string;
  };
  checklist: ChecklistItem[];
  collapsedChecklist: boolean;
  completed: boolean;
  createdAt: string;
  group: {
    approval: {
      approved: boolean;
      requested: boolean;
      required: boolean;
    };
    assignedUsers: string[];
  };
  id: string;
  notes: string;
  priority: TaskPriority;
  reminders: string[];
  tags: string[];
  text: string;
  type: TaskType;
  updatedAt: string;
  userId: string;
  value: number;
};

export type UserCredentials = {
  apiToken: string;
  userId: string;
};

/**
 * The Habitica account a user linked, as shown in the browser. The API token
 * never leaves the server.
 */
export type HabiticaAccount = {
  /** False when the saved token can no longer be read and must be re-entered. */
  hasApiToken: boolean;
  userId: string;
};

export type UserStats = {
  buffs: Buffs;
  class: string;
  con: number;
  exp: number;
  gp: number;
  hp: number;
  int: number;
  lvl: number;
  maxHealth: number;
  maxMP: number;
  mp: number;
  per: number;
  points: number;
  str: number;
  toNextLevel: number;
  training: {
    con: number;
    int: number;
    per: number;
    str: number;
  };
  userId: string;
};

export type CreateTaskParameters = {
  alias?: string;
  attribute?: TaskAttribute;
  checklist?: ChecklistItem[];
  collapseChecklist?: boolean;
  date?: Date;
  daysOfMonth?: number[];
  down?: boolean;
  everyX?: number;
  frequency?: TaskFrequency;
  notes?: string;
  priority?: TaskPriority;
  reminders?: {
    id: string;
    startDate: string;
    time: string;
  }[];
  repeat?:
    | {
        f?: boolean;
        m?: boolean;
        s?: boolean;
        su?: boolean;
        t?: boolean;
        th?: boolean;
        w?: boolean;
      }
    | true;
  streak?: number;
  tags?: string[];
  text: string;
  type: TaskType;
  up?: boolean;
  value?: number;
  weeksOfMonth?: number[];
};

export type APIResponse<M> = {
  data: M;
  notifications: string[];
  success: boolean;
};

export type Buffs = {
  con: number;
  int: number;
  per: number;
  seafoam: boolean;
  shinySeed: boolean;
  snowball: boolean;
  spookySparkles: boolean;
  stealth: number;
  str: number;
  streaks: boolean;
};

export type ScoreTaskResponse = {
  _tmp: Record<string, number | string>;
  buffs: Buffs;
  class: string;
  con: number;
  delta: number;
  exp: number;
  gp: number;
  hp: number;
  int: number;
  lvl: number;
  mp: number;
  per: number;
  points: null;
  str: number;
  training: {
    con: number;
    int: number;
    per: number;
    str: number;
  };
};
