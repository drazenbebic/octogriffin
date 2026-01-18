import { TaskDirection } from '@/enums/habitica';
import logger from '@/lib/logger';
import {
  APIResponse,
  CreateTaskParameters,
  ScoreTaskResponse,
  Task,
  UserStats,
} from '@/types/habitica';

const BASE_URL = 'https://habitica.com/api/v3';

class HabiticaApi {
  private readonly headers: HeadersInit;

  constructor(userId: string, apiToken: string) {
    const devId = process.env.HABITICA_USER_ID!;
    const appName = process.env.HABITICA_APP_NAME!;

    this.headers = {
      'Content-Type': 'application/json',
      'x-api-user': userId,
      'x-api-key': apiToken,
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

      throw new Error(message);
    }

    const json = (await response.json()) as APIResponse<T>;

    return json.data;
  }

  createTask = (payload: CreateTaskParameters) => {
    return this.request<Task>('/tasks/user', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  };

  getTasks = () => {
    return this.request<Task[]>('/tasks/user', {
      method: 'GET',
    });
  };

  findTaskByAlias = async (alias: string) => {
    return await this.request<Task>(`/tasks/${alias}`, {
      method: 'GET',
    });
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
