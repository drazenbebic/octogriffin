import type { EmitterWebhookEvent } from '@octokit/webhooks';

import type { RewardDeps } from '@/rewards/deliverRewards';
import type { Delivery } from '@/rewards/types';

import type { WebhookEventName } from './webhookEvents';

/**
 * A GitHub event as a handler gets it, under its full name, e.g.
 * `pull_request.closed` rather than GitHub's `pull_request`.
 */
export type WebhookEvent<K extends WebhookEventName = WebhookEventName> =
  K extends WebhookEventName
    ? {
        delivery: Delivery;
        name: K;
        payload: EmitterWebhookEvent<K>['payload'];
      }
    : never;

/**
 * What handlers work with, so tests can hand in their own.
 */
export type WebhookDeps = {
  rewards: RewardDeps;
};

export type WebhookHandler<K extends WebhookEventName> = (
  event: WebhookEvent<K>,
  deps: WebhookDeps,
) => Promise<void>;
