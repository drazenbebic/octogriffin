export enum TaskType {
  DAILY = 'daily',
  HABIT = 'habit',
  REWARD = 'reward',
  TODO = 'todo',
}

export enum TaskAttribute {
  CON = 'con',
  INT = 'int',
  PER = 'per',
  STR = 'str',
}

export enum TaskPriority {
  LOW = 0.1,
  NORMAL = 1,
  HIGH = 1.5,
  CRITICAL = 2,
}

export enum TaskFrequency {
  DAILY = 'daily',
  MONTHLY = 'monthly',
  WEEKLY = 'weekly',
}

export enum TaskDirection {
  DOWN = 'down',
  UP = 'up',
}
