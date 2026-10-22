import type { Metadata } from 'next';

import { WebhookLogsList } from '@/components/dashboard/WebhookLogsList';

export const metadata: Metadata = {
  description:
    'Monitor incoming GitHub webhooks in real-time. Inspect event payloads, track delivery status, and troubleshoot your trigger executions.',
  title: 'Webhook Logs',
};

export default function DashboardHistoryPage() {
  return <WebhookLogsList />;
}
