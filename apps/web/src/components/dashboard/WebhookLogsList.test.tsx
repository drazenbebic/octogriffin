import { renderToString } from 'react-dom/server';

import { WebhookLogsList } from './WebhookLogsList';

jest.mock('@/actions/webhookLogs/getWebhookLogsAction', () => ({
  getWebhookLogsAction: jest.fn(),
}));

describe('WebhookLogsList', () => {
  it('does not claim there is no activity in the first, server-rendered paint', () => {
    expect(renderToString(<WebhookLogsList />)).not.toContain(
      'No activity yet',
    );
  });
});
