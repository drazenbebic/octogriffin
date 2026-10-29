import { withRetry } from './withRetry';

describe('withRetry', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('tries again after 1, 2 and 4 seconds', async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error('first'))
      .mockRejectedValueOnce(new Error('second'))
      .mockRejectedValueOnce(new Error('third'))
      .mockResolvedValue('done');

    const result = withRetry(fn);

    await jest.advanceTimersByTimeAsync(999);
    expect(fn).toHaveBeenCalledTimes(1);

    await jest.advanceTimersByTimeAsync(1 + 2_000 + 4_000);
    await expect(result).resolves.toBe('done');
    expect(fn).toHaveBeenCalledTimes(4);
  });

  it('gives up with the last error', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('Habitica is down'));

    const result = withRetry(fn, { retries: 1 });
    const assertion = expect(result).rejects.toThrow('Habitica is down');

    await jest.advanceTimersByTimeAsync(1_000);
    await assertion;
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('starts no attempt once the signal has aborted', async () => {
    const controller = new AbortController();
    const fn = jest.fn().mockImplementation(async () => {
      controller.abort();
      throw new Error('Habitica is down');
    });

    await expect(withRetry(fn, { signal: controller.signal })).rejects.toThrow(
      'Habitica is down',
    );
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('stops waiting for the next attempt when the signal aborts', async () => {
    const controller = new AbortController();
    const fn = jest.fn().mockRejectedValue(new Error('Habitica is down'));

    const result = withRetry(fn, { signal: controller.signal });
    const assertion = expect(result).rejects.toThrow('Habitica is down');

    await jest.advanceTimersByTimeAsync(500);
    controller.abort();

    await assertion;
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
