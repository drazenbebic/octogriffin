import { recordMarketplaceEvent } from '@/accessors/marketplaceEvent';
import type { Prisma } from '@/generated/prisma/client';
import logger from '@/lib/logger';
import type { WebhookEvent } from '@/webhooks/types';

// GitHub includes an organisation's billing email, which we don't keep.
const withoutBillingEmail = (payload: object): Prisma.InputJsonValue =>
  JSON.parse(
    JSON.stringify(payload, (key, value) =>
      key === 'organization_billing_email' ? undefined : value,
    ),
  );

export const handleMarketplacePurchase = async ({
  delivery,
  payload,
}: WebhookEvent<'marketplace_purchase'>) => {
  const {
    action,
    effective_date: effectiveDate,
    marketplace_purchase: { account, plan },
    sender,
  } = payload;

  const isRecorded = await recordMarketplaceEvent({
    accountId: account.id,
    accountLogin: account.login,
    accountType: account.type,
    action,
    deliveryUuid: delivery.id,
    effectiveDate: new Date(effectiveDate),
    payload: withoutBillingEmail(payload),
    planId: plan.id,
    planName: plan.name,
    senderId: sender.id,
    senderLogin: sender.login,
  });

  if (!isRecorded) {
    logger.info('Ignored: Marketplace event was already recorded.');

    return;
  }

  logger.info(
    { account: account.login, action, plan: plan.name },
    'Marketplace event recorded.',
  );
};
