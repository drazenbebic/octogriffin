import type { TaskDirection } from '@/enums/habitica';
import logger from '@/lib/logger';
import type {
  APIResponse,
  CreateTaskParameters,
  ScoreTaskResponse,
  Task,
  UserStats,
} from '@/types/habitica';

const BASE_URL = 'https://habitica.com/api/v3';

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

    const response = await fetch(url, {
      cache: 'no-store',
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      const message = `Habitica API Error [${response.status}]: ${errorText || response.statusText}`;

      logger.error(message);

      throw new HabiticaApiError(message, response.status);
    }

    const json = (await response.json()) as APIResponse<T>;

    return json.data;
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
      return await this.request<Task>(`/tasks/${alias}`, {
        method: 'GET',
      });
    } catch (error) {
      if (error instanceof HabiticaApiError && error.status === 404) {
        return null;
      }

      throw error;
    }
  };

  findTaskByTitle = async (title: string) => {
    const tasks = await this.getTasks();

    return tasks.find(t => t.text === title);
  };

  findOrCreateTask = async (payload: CreateTaskParameters) => {
    if (payload.alias) {
      const taskByAlias = await this.findTaskByAlias(payload.alias);

      if (taskByAlias) {
        return taskByAlias;
      }
    }

    const taskByTitle = await this.findTaskByTitle(payload.text);

    if (taskByTitle) {
      return taskByTitle;
    }

    return this.createTask(payload);
  };

  scoreTask = (taskId: string, direction: TaskDirection) => {
    return this.request<ScoreTaskResponse>(
      `/tasks/${taskId}/score/${direction}`,
      {
        method: 'POST',
      },
    );
  };

  tagTask = (taskId: string, tagId: string) => {
    return this.request<Task>(`/tasks/${taskId}/tags/${tagId}`, {
      method: 'POST',
    });
  };

  getUserStats = () => {
    return this.request<{ stats: UserStats }>('/user', {
      method: 'GET',
    });
  };
}

export default HabiticaApi;
