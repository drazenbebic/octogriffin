import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';

import { Webhooks } from '@octokit/webhooks';

import { requestContext } from '@/lib/context';
import logger from '@/lib/logger';
import { withRetry } from '@/utils/withRetry';

import { initWebhookHandlers } from './initWebhookHandlers';

const webhooks = new Webhooks({
  secret: process.env.GITHUB_WEBHOOK_SECRET!,
});

initWebhookHandlers(webhooks);

export const maxDuration = 60;

export const dynamic = 'force-dynamic';

export const POST = async (request: NextRequest) => {
  const signature = request.headers.get('x-hub-signature-256') ?? '';
  const id = request.headers.get('x-github-delivery') ?? '';
  const eventName = request.headers.get('x-github-event') ?? '';
  const hookId = request.headers.get('x-github-hook-id') ?? '';
  const rawBody = await request.text();

  const isValid = await webhooks.verify(rawBody, signature);

  if (!isValid) {
    logger.warn('Invalid signature received');
    return new NextResponse('Invalid Signature', { status: 401 });
  }

  after(async () => {
    await requestContext.run(
      { requestId: id, eventName, signature, hookId },
      async () => {
        try {
          logger.info('Processing in background.');

          await withRetry(() =>
            webhooks.receive({
              id,
              // @ts-expect-error Just a type mismatch
              name: eventName,
              payload: JSON.parse(rawBody),
            }),
          );

          logger.info('Processed successfully.');
        } catch (error) {
          logger.error({ error }, 'Background processing failed.');
        }
      },
    );
  });

  return NextResponse.json(
    { message: 'Accepted', deliveryUuid: id },
    { status: 202 },
  );
};
