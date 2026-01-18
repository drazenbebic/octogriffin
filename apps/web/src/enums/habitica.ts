export enum TaskType {
  HABIT = 'habit',
  DAILY = 'daily',
  TODO = 'todo',
  REWARD = 'reward',
}

export enum TaskAttribute {
  STR = 'str',
  INT = 'int',
  PER = 'per',
  CON = 'con',
}

export enum TaskPriority {
  LOW = 0.1,
  NORMAL = 1,
  HIGH = 1.5,
  CRITICAL = 2,
}

export enum TaskFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export enum TaskDirection {
  UP = 'up',
  DOWN = 'down',
}
