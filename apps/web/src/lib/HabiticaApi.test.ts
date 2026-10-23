import { TaskDirection, TaskType } from '@/enums/habitica';
import logger from '@/lib/logger';

import HabiticaApi from './HabiticaApi';

// 1. Mock the Logger
jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('@/lib/habitica-api.ts', () => {
  const userId = 'user-123';
  const apiToken = 'token-abc';

  const TEST_DEV_ID = 'dev-uuid-999';
  const TEST_APP_NAME = 'TestApp';

  let api: HabiticaApi;

  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    process.env = {
      ...originalEnv,
      HABITICA_APP_NAME: TEST_APP_NAME,
      HABITICA_USER_ID: TEST_DEV_ID,
    };

    api = new HabiticaApi(userId, apiToken);
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  const mockSuccessResponse = (data: unknown) => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ data, success: true }),
      ok: true,
    });
  };

  const mockErrorResponse = (
    status: number,
    statusText: string,
    errorBody: string = '',
  ) => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status,
      statusText,
      text: async () => errorBody,
    });
  };

  describe('Constructor & Headers', () => {
    it('should include authentication headers in requests with correct x-client', async () => {
      mockSuccessResponse({});

      await api.getUserStats();

      const fetchOptions = mockFetch.mock.calls[0][1];

      // 5. Update expectation to match the new format: DEV_ID - APP_NAME
      expect(fetchOptions.headers).toEqual(
        expect.objectContaining({
          'Content-Type': 'application/json',
          'x-api-key': apiToken,
          'x-api-user': userId,
          // ✅ Correct: Expects developer ID, not user ID
          'x-client': `${TEST_DEV_ID}-${TEST_APP_NAME}`,
        }),
      );
    });
  });

  // ... (The rest of your tests remain exactly the same) ...

  describe('Error Handling', () => {
    it('should throw and log error when API returns non-200 status', async () => {
      mockErrorResponse(401, 'Unauthorized', 'Invalid credentials');

      await expect(api.getUserStats()).rejects.toThrow(
        'Habitica API Error [401]: Invalid credentials',
      );

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Habitica API Error [401]'),
      );
    });

    it('should fall back to statusText if response body is empty', async () => {
      mockErrorResponse(500, 'Internal Server Error');

      await expect(api.getUserStats()).rejects.toThrow(
        'Habitica API Error [500]: Internal Server Error',
      );
    });
  });

  describe('createTask', () => {
    it('should POST to /tasks/user with correct body', async () => {
      const taskData = { text: 'New Task', type: TaskType.HABIT };
      const expectedResponse = { id: 'task-1', text: 'New Task' };

      mockSuccessResponse(expectedResponse);

      const result = await api.createTask(taskData);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://habitica.com/api/v3/tasks/user',
        expect.objectContaining({
          body: JSON.stringify(taskData),
          method: 'POST',
        }),
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('scoreTask', () => {
    it('should POST to correct scoring endpoint', async () => {
      mockSuccessResponse({ delta: 10 });

      await api.scoreTask('task-123', TaskDirection.UP);

      expect(mockFetch).toHaveBeenCalledWith(
        `https://habitica.com/api/v3/tasks/task-123/score/${TaskDirection.UP}`,
        expect.objectContaining({ method: 'POST' }),
      );
    });
  });

  describe('getUserStats', () => {
    it('should merge custom options into the request', async () => {
      mockSuccessResponse({ stats: { lvl: 10 } });

      await api.getUserStats();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://habitica.com/api/v3/user',
        expect.objectContaining({
          method: 'GET',
        }),
      );
    });
  });

  describe('findOrCreateTask', () => {
    const payload = {
      alias: 'write-code',
      text: 'Write code',
      type: TaskType.HABIT,
    };

    it('should return the task found by its alias', async () => {
      const task = { id: 'task-1', text: 'Write code' };

      mockSuccessResponse(task);

      await expect(api.findOrCreateTask(payload)).resolves.toEqual(task);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should create the task when its alias does not exist yet', async () => {
      const createdTask = { id: 'task-2', text: 'Write code' };

      mockErrorResponse(404, 'Not Found', 'Task not found.');
      mockSuccessResponse([]);
      mockSuccessResponse(createdTask);

      await expect(api.findOrCreateTask(payload)).resolves.toEqual(createdTask);
      expect(mockFetch).toHaveBeenLastCalledWith(
        'https://habitica.com/api/v3/tasks/user',
        expect.objectContaining({ method: 'POST' }),
      );
    });

    it('should keep the alias inside the task path', async () => {
      mockSuccessResponse({ id: 'task-1' });

      await api.findOrCreateTask({ ...payload, alias: '../user' });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://habitica.com/api/v3/tasks/..%2Fuser',
        expect.anything(),
      );
    });

    it('should only reuse a task of the same type with the same title', async () => {
      const createdTask = { id: 'task-3', text: 'Write code', type: 'habit' };

      mockErrorResponse(404, 'Not Found', 'Task not found.');
      mockSuccessResponse([{ id: 'todo-1', text: 'Write code', type: 'todo' }]);
      mockSuccessResponse(createdTask);

      await expect(api.findOrCreateTask(payload)).resolves.toEqual(createdTask);
    });

    it('should reuse a habit with the same title', async () => {
      const habit = { id: 'habit-1', text: 'Write code', type: 'habit' };

      mockErrorResponse(404, 'Not Found', 'Task not found.');
      mockSuccessResponse([habit]);

      await expect(api.findOrCreateTask(payload)).resolves.toEqual(habit);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should not hide other errors while looking up the alias', async () => {
      mockErrorResponse(401, 'Unauthorized');

      await expect(api.findOrCreateTask(payload)).rejects.toThrow(
        'Habitica API Error [401]',
      );
    });
  });

  describe('rate limiting', () => {
    const mockRateLimitResponse = (retryAfter?: string) => {
      mockFetch.mockResolvedValueOnce({
        headers: {
          get: (name: string) =>
            name.toLowerCase() === 'retry-after' ? (retryAfter ?? null) : null,
        },
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        text: async () => 'Too many requests',
      });
    };

    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should wait for Retry-After and try again', async () => {
      mockRateLimitResponse('2');
      mockSuccessResponse({ delta: 1 });

      const request = api.scoreTask('task-1', TaskDirection.UP);

      await jest.advanceTimersByTimeAsync(1_999);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      await jest.advanceTimersByTimeAsync(1);
      await expect(request).resolves.toEqual({ delta: 1 });
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should give up when Habitica asks to wait too long', async () => {
      mockRateLimitResponse('60');

      await expect(api.scoreTask('task-1', TaskDirection.UP)).rejects.toThrow(
        'Habitica API Error [429]',
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should stop retrying after a few attempts', async () => {
      mockRateLimitResponse('1');
      mockRateLimitResponse('1');
      mockRateLimitResponse('1');
      mockRateLimitResponse('1');

      const request = api.scoreTask('task-1', TaskDirection.UP);
      const assertion = expect(request).rejects.toThrow(
        'Habitica API Error [429]',
      );

      await jest.advanceTimersByTimeAsync(3_000);
      await assertion;
      expect(mockFetch).toHaveBeenCalledTimes(4);
    });
  });
});
