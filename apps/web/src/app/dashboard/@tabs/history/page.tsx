import type { Metadata } from 'next';

import { WebhookLogsList } from '@/components/dashboard/WebhookLogsList';
import { generatePageMetadata } from '@/utils/seo';

export const generateMetadata = async (): Promise<Metadata> => {
  return generatePageMetadata({
    description:
      'Monitor incoming GitHub webhooks in real-time. Inspect event payloads, track delivery status, and troubleshoot your trigger executions.',
    path: 'dashboard/history',
    suffix: 'Octogriffin Dashboard',
    title: 'Webhook Logs',
  });
};

export default function DashboardHistoryPage() {
  return <WebhookLogsList />;
}
