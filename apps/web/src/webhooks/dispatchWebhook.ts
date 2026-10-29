import { requestContext } from '@/lib/context';
import logger from '@/lib/logger';
import type { Delivery } from '@/rewards/types';

import { handleInstallationCreated } from './handlers/handleInstallationCreated';
import { handleInstallationDeleted } from './handlers/handleInstallationDeleted';
import { handleInstallationRepositoriesAdded } from './handlers/handleInstallationRepositoriesAdded';
import { handleInstallationRepositoriesRemoved } from './handlers/handleInstallationRepositoriesRemoved';
import { handleInstallationSuspend } from './handlers/handleInstallationSuspend';
import { handleInstallationUnsuspend } from './handlers/handleInstallationUnsuspend';
import { handleMarketplacePurchase } from './handlers/handleMarketplacePurchase';
import { handlePush } from './handlers/handlePush';
import { handleRewardableEvent } from './handlers/handleRewardableEvent';
import type { WebhookDeps, WebhookEvent, WebhookHandler } from './types';
import type { RewardableEventName, WebhookEventName } from './webhookEvents';
import { rewardableEvents } from './webhookEvents';

// Every rewardable event but push shares one handler
const rewardHandlers = Object.fromEntries(
  rewardableEvents
    .filter(name => name !== 'push')
    .map(name => [name, handleRewardableEvent]),
) as {
  [K in Exclude<RewardableEventName, 'push'>]: WebhookHandler<K>;
};

// One handler for each event in webhookEvents, no more and no less
const handlers: { [K in WebhookEventName]: WebhookHandler<K> } = {
  ...rewardHandlers,
  'installation_repositories.added': handleInstallationRepositoriesAdded,
  'installation_repositories.removed': handleInstallationRepositoriesRemoved,
  'installation.created': handleInstallationCreated,
  'installation.deleted': handleInstallationDeleted,
  'installation.suspend': handleInstallationSuspend,
  'installation.unsuspend': handleInstallationUnsuspend,
  marketplace_purchase: handleMarketplacePurchase,
  push: handlePush,
};

const isHandled = (name: string): name is WebhookEventName =>
  Object.prototype.hasOwnProperty.call(handlers, name);

/**
 * The full name of the event, e.g. `pull_request.closed` for GitHub's
 * `pull_request` with action `closed`. Events handled without an action,
 * like `push` or `marketplace_purchase`, keep GitHub's name.
 */
const resolveEventName = (name: string, payload: unknown) => {
  const action =
    typeof payload === 'object' &&
    payload !== null &&
    'action' in payload &&
    typeof payload.action === 'string'
      ? payload.action
      : undefined;

  return [action && `${name}.${action}`, name].find(
    (candidate): candidate is WebhookEventName =>
      !!candidate && isHandled(candidate),
  );
};

/**
 * Handles a verified GitHub webhook delivery with the one handler for its
 * event. Events Octogriffin doesn't handle, like `ping`, are skipped.
 *
 * Rejects when the handler fails. Handlers must be safe to run again for the
 * same delivery, because a failed delivery is retried.
 */
export const dispatchWebhook = (
  {
    delivery,
    name,
    payload,
  }: {
    delivery: Delivery;
    /** GitHub's `x-github-event` header, e.g. `pull_request`. */
    name: string;
    payload: unknown;
  },
  deps: WebhookDeps,
) => {
  const eventName = resolveEventName(name, payload);

  return requestContext.run(
    {
      eventName: eventName ?? name,
      hookId: delivery.hookId,
      requestId: delivery.id,
    },
    async () => {
      if (!eventName) {
        logger.info('Ignored: Octogriffin does not handle this event.');

        return;
      }

      logger.info('Processing in background.');

      // GitHub's signature vouches that the payload belongs to its event
      const handler = handlers[eventName] as WebhookHandler<WebhookEventName>;

      await handler(
        { delivery, name: eventName, payload } as WebhookEvent,
        deps,
      );

      logger.info('Processed successfully.');
    },
  );
};
