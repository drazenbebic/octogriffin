import { HabiticaApiError } from '@/lib/HabiticaApi';

const TOO_MANY_REQUESTS = 429;
const SERVER_ERROR = 500;

/**
 * Habitica refusing a request, e.g. for a wrong API token, won't change by
 * trying again. Everything else, like Habitica being down, might.
 */
export const isRetryable = (error: unknown) =>
  !(error instanceof HabiticaApiError) ||
  error.status === TOO_MANY_REQUESTS ||
  error.status >= SERVER_ERROR;

/**
 * Thrown by a Reward Sink when not a single reward could be scored.
 */
export class RewardDeliveryError extends AggregateError {
  constructor(
    errors: unknown[],
    /** Whether trying again could help, e.g. because Habitica was down. */
    readonly isRetryable: boolean,
  ) {
    super(errors, 'No reward could be scored.');
    this.name = 'RewardDeliveryError';
  }
}
