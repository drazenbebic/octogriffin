import {
  TaskAttribute,
  TaskFrequency,
  TaskPriority,
  TaskType,
} from '@/enums/habitica';

export type ChecklistItem = {
  text: string;
  completed?: boolean;
};

export type Task = {
  userId: string;
  alias: string;
  text: string;
  type: TaskType;
  notes: string;
  tags: string[];
  value: number;
  priority: TaskPriority;
  attribute: TaskAttribute;
  challenge: {
    id: string;
  };
  group: {
    assignedUsers: string[];
    approval: {
      required: boolean;
      approved: boolean;
      requested: boolean;
    };
  };
  reminders: string[];
  _id: string;
  createdAt: string;
  updatedAt: string;
  checklist: ChecklistItem[];
  collapsedChecklist: boolean;
  completed: boolean;
  id: string;
};

export type UserCredentials = {
  userId: string;
  apiToken: string;
};

export type UserStats = {
  class: string;
  str: number;
  con: number;
  int: number;
  per: number;
  exp: number;
  lvl: number;
  gp: number;
  hp: number;
  maxHealth: number;
  mp: number;
  maxMP: number;
  points: number;
  toNextLevel: number;
  userId: string;
  buffs: Buffs;
  training: {
    str: number;
    con: number;
    int: number;
    per: number;
  };
};

export type CreateTaskParameters = {
  text: string;
  type: TaskType;
  tags?: string[];
  alias?: string;
  attribute?: TaskAttribute;
  checklist?: ChecklistItem[];
  collapseChecklist?: boolean;
  notes?: string;
  date?: Date;
  priority?: TaskPriority;
  reminders?: {
    id: string;
    startDate: string;
    time: string;
  }[];
  frequency?: TaskFrequency;
  repeat?:
    | true
    | {
        su?: boolean;
        m?: boolean;
        t?: boolean;
        w?: boolean;
        th?: boolean;
        f?: boolean;
        s?: boolean;
      };
  everyX?: number;
  streak?: number;
  daysOfMonth?: number[];
  weeksOfMonth?: number[];
  up?: boolean;
  down?: boolean;
  value?: number;
};

export type APIResponse<M> = {
  success: boolean;
  data: M;
  notifications: string[];
};

export type Buffs = {
  str: number;
  con: number;
  int: number;
  per: number;
  stealth: number;
  streaks: boolean;
  snowball: boolean;
  spookySparkles: boolean;
  shinySeed: boolean;
  seafoam: boolean;
};

export type ScoreTaskResponse = {
  delta: number;
  _tmp: Record<string, string | number>;
  hp: number;
  mp: number;
  exp: number;
  gp: number;
  lvl: number;
  class: string;
  points: null;
  str: number;
  con: number;
  int: number;
  per: number;
  buffs: Buffs;
  training: {
    str: number;
    con: number;
    int: number;
    per: number;
  };
};
