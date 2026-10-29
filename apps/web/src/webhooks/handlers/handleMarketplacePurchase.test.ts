import { recordMarketplaceEvent } from '@/accessors/marketplaceEvent';
import logger from '@/lib/logger';
import type { WebhookEvent } from '@/webhooks/types';

import { handleMarketplacePurchase } from './handleMarketplacePurchase';

jest.mock('@/accessors/marketplaceEvent', () => ({
  recordMarketplaceEvent: jest.fn(),
}));
jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: { info: jest.fn() },
}));

const mockRecord = recordMarketplaceEvent as jest.Mock;

const purchase = (organizationBillingEmail: null | string) => ({
  account: {
    id: 42,
    login: 'octo-org',
    node_id: 'O_42',
    organization_billing_email: organizationBillingEmail,
    type: 'Organization',
  },
  plan: { id: 7, name: 'Free', price_model: 'FREE' },
});

const event = {
  delivery: { hookId: 'hook-1', id: 'delivery-1', signature: 'sha256=abc' },
  name: 'marketplace_purchase',
  payload: {
    action: 'changed',
    effective_date: '2026-10-22T12:00:00+00:00',
    marketplace_purchase: purchase('billing@octo-org.example'),
    previous_marketplace_purchase: purchase('billing@octo-org.example'),
    sender: { id: 1, login: 'octocat' },
  },
} as unknown as WebhookEvent<'marketplace_purchase'>;

describe('handleMarketplacePurchase', () => {
  it('records who changed which plan and when', async () => {
    mockRecord.mockResolvedValue(true);

    await handleMarketplacePurchase(event);

    expect(mockRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        accountId: 42,
        accountLogin: 'octo-org',
        accountType: 'Organization',
        action: 'changed',
        deliveryUuid: 'delivery-1',
        effectiveDate: new Date('2026-10-22T12:00:00Z'),
        planId: 7,
        planName: 'Free',
        senderId: 1,
        senderLogin: 'octocat',
      }),
    );
  });

  it('keeps the full payload without billing emails', async () => {
    mockRecord.mockResolvedValue(true);

    await handleMarketplacePurchase(event);

    const { payload } = mockRecord.mock.calls[0][0];

    expect(JSON.stringify(payload)).not.toContain('billing@');
    expect(payload.marketplace_purchase.plan.price_model).toBe('FREE');
    expect(payload.previous_marketplace_purchase.account.login).toBe(
      'octo-org',
    );
  });

  it('skips a delivery that was already recorded', async () => {
    mockRecord.mockResolvedValue(false);

    await handleMarketplacePurchase(event);

    expect(logger.info).toHaveBeenCalledWith(
      'Ignored: Marketplace event was already recorded.',
    );
    expect(logger.info).not.toHaveBeenCalledWith(
      expect.anything(),
      'Marketplace event recorded.',
    );
  });
});
