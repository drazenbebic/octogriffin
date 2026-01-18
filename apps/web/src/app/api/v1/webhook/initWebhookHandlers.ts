import {
  EmitterWebhookEvent,
  EmitterWebhookEventName,
  Webhooks,
} from '@octokit/webhooks';

import logger from '@/lib/logger';

import { handleInstallationCreated } from './handlers/handleInstallationCreated';
import { handleInstallationDeleted } from './handlers/handleInstallationDeleted';
import { handleInstallationRepositoriesAdded } from './handlers/handleInstallationRepositoriesAdded';
import { handleInstallationRepositoriesRemoved } from './handlers/handleInstallationRepositoriesRemoved';
import { handleInstallationSuspend } from './handlers/handleInstallationSuspend';
import { handleInstallationUnsuspend } from './handlers/handleInstallationUnsuspend';
import { handleLogWebhook } from './handlers/handleLogWebhook';
import { handlePush } from './handlers/handlePush';
import { handleUniversal } from './handlers/handleUniversal';
import {
  DedicatedWebhookEvents,
  supportedWebhooks,
  universalHandlerWebhooks,
  UniversalWebhookEvents,
} from './webhookConstants';

// Map the dedicated webhook events to their handlers
export const dedicatedWebhookHandlerMap: {
  [K in DedicatedWebhookEvents]: (
    params: EmitterWebhookEvent<K>,
  ) => Promise<void>;
} = {
  'installation.created': handleInstallationCreated,
  'installation.deleted': handleInstallationDeleted,
  'installation_repositories.added': handleInstallationRepositoriesAdded,
  'installation_repositories.removed': handleInstallationRepositoriesRemoved,
  'installation.suspend': handleInstallationSuspend,
  'installation.unsuspend': handleInstallationUnsuspend,
  push: handlePush,
};

type UniversalWebhookHandlerMap = {
  [K in UniversalWebhookEvents]: (
    params: EmitterWebhookEvent<K>,
    event: EmitterWebhookEventName,
  ) => Promise<void>;
};

// Map the universal webhook events to the universal handler
export const universalWebhookHandlerMap = universalHandlerWebhooks.reduce<
  Partial<UniversalWebhookHandlerMap>
>((acc, eventName) => {
  acc[eventName] = handleUniversal;

  return acc;
}, {});

/**
 * Initialize all supported webhooks of the application.
 */
export const initWebhookHandlers = (webhooks: Webhooks) => {
  // Dedicated webhooks
  for (const [event, handler] of Object.entries(dedicatedWebhookHandlerMap)) {
    webhooks.on(
      event as EmitterWebhookEventName,
      handler as (params: EmitterWebhookEvent) => Promise<void>,
    );
  }

  // Universal webhooks
  for (const [event, handler] of Object.entries(universalWebhookHandlerMap)) {
    webhooks.on(event as EmitterWebhookEventName, async params => {
      const webhookHandler = handler as (
        payload: EmitterWebhookEvent,
        event: EmitterWebhookEventName,
      ) => Promise<void>;

      return webhookHandler(params, event as EmitterWebhookEventName);
    });
  }

  // Run webhook logger separately
  webhooks.onAny(async event => {
    const isSupported = supportedWebhooks.some(webhook =>
      webhook.includes(event.name),
    );

    if (!isSupported) {
      logger.info(
        { eventName: event.name },
        'Unsupported Webhook. Not logged.',
      );
      return;
    }

    await handleLogWebhook(event);
  });

  // Error handling.
  webhooks.onError(error => {
    logger.error({ error }, 'Webhook Library Error');
  });
};
