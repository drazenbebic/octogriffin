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
