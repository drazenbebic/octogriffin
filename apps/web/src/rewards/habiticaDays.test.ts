import HabiticaApi, { HabiticaApiError } from '@/lib/HabiticaApi';

import { habiticaDays } from './habiticaDays';

jest.mock('@/lib/HabiticaApi', () => ({
  ...jest.requireActual('@/lib/HabiticaApi'),
  __esModule: true,
  default: jest.fn(),
}));

const MockHabiticaApi = HabiticaApi as jest.MockedClass<typeof HabiticaApi>;

describe('habiticaDays', () => {
  it("builds the day from the user's settings", async () => {
    const deadline = new AbortController().signal;

    MockHabiticaApi.mockImplementation(
      () =>
        ({
          getDayPreferences: jest
            .fn()
            .mockResolvedValue({ dayStart: 0, timezoneOffset: 420 }),
        }) as unknown as HabiticaApi,
    );

    await expect(
      habiticaDays(deadline).today(
        { apiToken: 'token', userId: 'user' },
        new Date('2026-10-24T05:00:00Z'),
      ),
    ).resolves.toBe('2026-10-23');
    expect(MockHabiticaApi).toHaveBeenCalledWith('user', 'token', deadline);
  });

  it.each([
    [
      'the API token is wrong',
      new HabiticaApiError('Unauthorized', 401),
      false,
    ],
    ['Habitica is busy', new HabiticaApiError('Too Many Requests', 429), true],
    ['Habitica is down', new HabiticaApiError('Unavailable', 503), true],
  ])('says whether to try again when %s', async (_, error, isRetryable) => {
    MockHabiticaApi.mockImplementation(
      () =>
        ({
          getDayPreferences: jest.fn().mockRejectedValue(error),
        }) as unknown as HabiticaApi,
    );

    await expect(
      habiticaDays().today(
        { apiToken: 'token', userId: 'user' },
        new Date('2026-10-24T05:00:00Z'),
      ),
    ).rejects.toMatchObject({ isRetryable, name: 'RewardDeliveryError' });
  });
});
