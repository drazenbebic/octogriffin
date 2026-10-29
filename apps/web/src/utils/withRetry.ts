type RetryOptions = {
  delay?: number;
  retries?: number;
  /** No attempt starts once it aborts, and the wait before one ends early. */
  signal?: AbortSignal;
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  { delay = 1000, retries = 3, signal }: RetryOptions = {},
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0 || signal?.aborted) {
      throw error;
    }

    await new Promise<void>(resolve => {
      const timer = setTimeout(resolve, delay);

      signal?.addEventListener(
        'abort',
        () => {
          clearTimeout(timer);
          resolve();
        },
        { once: true },
      );
    });

    // The last error says more than the abort does
    if (signal?.aborted) {
      throw error;
    }

    return withRetry(fn, { delay: delay * 2, retries: retries - 1, signal });
  }
}
