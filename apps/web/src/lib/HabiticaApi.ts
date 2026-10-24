import type { TaskDirection, TaskType } from '@/enums/habitica';
import logger from '@/lib/logger';
import type {
  APIResponse,
  CreateTaskParameters,
  ScoreTaskResponse,
  Task,
  UserStats,
} from '@/types/habitica';
import type { DayPreferences } from '@/utils/habiticaDay';

const BASE_URL = 'https://habitica.com/api/v3';

const TOO_MANY_REQUESTS = 429;
const MAX_RATE_LIMIT_RETRIES = 3;
// Webhooks must finish within a minute, so don't wait longer than this.
const MAX_RATE_LIMIT_WAIT_MS = 15_000;
const DEFAULT_RATE_LIMIT_WAIT_MS = 1_000;

/**
 * How long Habitica asks us to wait before retrying, from `Retry-After`
 * (seconds or an HTTP date).
 */
const getRetryAfterMs = (response: Response) => {
  const retryAfter = response.headers.get('retry-after');

  if (!retryAfter) {
    return DEFAULT_RATE_LIMIT_WAIT_MS;
  }

  const seconds = Number(retryAfter);

  if (!Number.isNaN(seconds)) {
    return seconds * 1_000;
  }

  const date = Date.parse(retryAfter);

  return Number.isNaN(date)
    ? DEFAULT_RATE_LIMIT_WAIT_MS
    : Math.max(0, date - Date.now());
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class HabiticaApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'HabiticaApiError';
  }
}

class HabiticaApi {
  private readonly headers: HeadersInit;

  constructor(userId: string, apiToken: string) {
    const devId = process.env.HABITICA_USER_ID!;
    const appName = process.env.HABITICA_APP_NAME!;

    this.headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiToken,
      'x-api-user': userId,
      'x-client': `${devId}-${appName}`,
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;

    let response = await this.fetch(url, options);

    // Respect Habitica's rate limit, as long as the wait stays reasonable
    for (
      let attempt = 1;
      response.status === TOO_MANY_REQUESTS &&
      attempt <= MAX_RATE_LIMIT_RETRIES;
      attempt++
    ) {
      const waitMs = getRetryAfterMs(response);

      if (waitMs > MAX_RATE_LIMIT_WAIT_MS) {
        break;
      }

      logger.warn({ attempt, endpoint, waitMs }, 'Habitica rate limit hit.');

      await wait(waitMs);

      response = await this.fetch(url, options);
    }

    if (!response.ok) {
      const errorText = await response.text();
      const message = `Habitica API Error [${response.status}]: ${errorText || response.statusText}`;

      logger.error(message);

      throw new HabiticaApiError(message, response.status);
    }

    const json = (await response.json()) as APIResponse<T>;

    return json.data;
  }

  private fetch(url: string, options: RequestInit) {
    return fetch(url, {
      cache: 'no-store',
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
    });
  }

  createTask = (payload: CreateTaskParameters) => {
    return this.request<Task>('/tasks/user', {
      body: JSON.stringify(payload),
      method: 'POST',
    });
  };

  getTasks = () => {
    return this.request<Task[]>('/tasks/user', {
      method: 'GET',
    });
  };

  findTaskByAlias = async (alias: string) => {
    try {
      return await this.request<Task>(`/tasks/${encodeURIComponent(alias)}`, {
        method: 'GET',
      });
    } catch (error) {
      if (error instanceof HabiticaApiError && error.status === 404) {
        return null;
      }

      throw error;
    }
  };

  findTaskByTitle = async (title: string, type: TaskType) => {
    const tasks = await this.getTasks();

    // A To-Do or Daily with the same title isn't the task we're looking for
    return tasks.find(t => t.type === type && t.text === title);
  };

  findOrCreateTask = async (payload: CreateTaskParameters) => {
    if (payload.alias) {
      const taskByAlias = await this.findTaskByAlias(payload.alias);

      if (taskByAlias) {
        return taskByAlias;
      }
    }

    const taskByTitle = await this.findTaskByTitle(payload.text, payload.type);

    if (taskByTitle) {
      return taskByTitle;
    }

    return this.createTask(payload);
  };

  scoreTask = (taskId: string, direction: TaskDirection) => {
    return this.request<ScoreTaskResponse>(
      `/tasks/${encodeURIComponent(taskId)}/score/${direction}`,
      {
        method: 'POST',
      },
    );
  };

  tagTask = (taskId: string, tagId: string) => {
    return this.request<Task>(
      `/tasks/${encodeURIComponent(taskId)}/tags/${encodeURIComponent(tagId)}`,
      {
        method: 'POST',
      },
    );
  };

  /** When the user's day starts, the way Habitica's cron reads it. */
  getDayPreferences = async (): Promise<DayPreferences> => {
    const { preferences } = await this.request<{
      preferences?: Partial<DayPreferences>;
    }>('/user?userFields=preferences.dayStart,preferences.timezoneOffset', {
      method: 'GET',
    });

    const toNumber = (value: unknown) =>
      typeof value === 'number' && Number.isFinite(value) ? value : 0;

    return {
      dayStart: toNumber(preferences?.dayStart),
      timezoneOffset: toNumber(preferences?.timezoneOffset),
    };
  };

  getUserStats = () => {
    return this.request<{ stats: UserStats }>('/user', {
      method: 'GET',
    });
  };
}

export default HabiticaApi;
