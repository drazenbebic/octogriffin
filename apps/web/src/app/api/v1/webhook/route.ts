import type { NextRequest } from 'next/server';
import { after, NextResponse } from 'next/server';

import { verify } from '@octokit/webhooks-methods';

import logger from '@/lib/logger';
import { rewardDeps } from '@/rewards/rewardDeps';
import type { Delivery } from '@/rewards/types';
import { withRetry } from '@/utils/withRetry';
import { dispatchWebhook } from '@/webhooks/dispatchWebhook';

export const maxDuration = 60;

export const dynamic = 'force-dynamic';

// Ends retries and Habitica calls with time left to give back what a
// delivery claimed, before Vercel stops the function at maxDuration
const DELIVERY_BUDGET_MS = 50_000;

export const POST = async (request: NextRequest) => {
  const signature = request.headers.get('x-hub-signature-256') ?? '';
  const rawBody = await request.text();

  // verify throws instead of answering false when either is empty
  const isValid =
    !!signature &&
    !!rawBody &&
    (await verify(process.env.GITHUB_WEBHOOK_SECRET!, rawBody, signature));

  if (!isValid) {
    logger.warn('Invalid signature received');

    return new NextResponse('Invalid Signature', { status: 401 });
  }

  const id = request.headers.get('x-github-delivery');
  const name = request.headers.get('x-github-event');

  // The delivery ID keeps an event from being rewarded twice
  if (!id || !name) {
    logger.warn('Delivery or event header missing.');

    return new NextResponse('Missing Delivery Headers', { status: 400 });
  }

  let payload: unknown;

  try {
    payload = JSON.parse(rawBody);
  } catch {
    logger.warn({ requestId: id }, 'Payload is not valid JSON.');

    return new NextResponse('Invalid JSON', { status: 400 });
  }

  const delivery: Delivery = {
    hookId: request.headers.get('x-github-hook-id') ?? '',
    id,
    signature,
  };

  const deadline = AbortSignal.timeout(DELIVERY_BUDGET_MS);

  after(async () => {
    try {
      await withRetry(
        () =>
          dispatchWebhook(
            { delivery, name, payload },
            { rewards: rewardDeps(deadline) },
          ),
        { signal: deadline },
      );
    } catch (error) {
      logger.error(
        { error, eventName: name, requestId: id },
        'Background processing failed.',
      );
    }
  });

  return NextResponse.json(
    { deliveryUuid: id, message: 'Accepted' },
    { status: 202 },
  );
};
