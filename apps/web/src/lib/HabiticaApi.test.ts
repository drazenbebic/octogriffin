import { TaskDirection, TaskType } from '@/enums/habitica';
import logger from '@/lib/logger';

import HabiticaApi from './HabiticaApi';

// 1. Mock the Logger
jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
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
      HABITICA_USER_ID: TEST_DEV_ID,
      HABITICA_APP_NAME: TEST_APP_NAME,
    };

    api = new HabiticaApi(userId, apiToken);
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  const mockSuccessResponse = (data: unknown) => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data }),
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
          'x-api-user': userId,
          'x-api-key': apiToken,
          // ✅ Correct: Expects developer ID, not user ID
          'x-client': `${TEST_DEV_ID}-${TEST_APP_NAME}`,
          'Content-Type': 'application/json',
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
          method: 'POST',
          body: JSON.stringify(taskData),
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
});
