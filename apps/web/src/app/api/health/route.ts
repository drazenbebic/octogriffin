import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createHash, timingSafeEqual } from 'node:crypto';

import logger from '@/lib/logger';
import prisma from '@/lib/prisma';

const BEARER_PREFIX = 'Bearer ';

const getKey = (request: NextRequest) => {
  const authorization = request.headers.get('authorization');

  if (authorization?.startsWith(BEARER_PREFIX)) {
    return authorization.slice(BEARER_PREFIX.length);
  }

  // Still accepted for existing monitors. It ends up in request logs, so
  // prefer the header.
  return request.nextUrl.searchParams.get('key');
};

// Hashing gives both sides the same length, which timingSafeEqual needs
const sha256 = (value: string) => createHash('sha256').update(value).digest();

const isAuthorized = (key: null | string, secret: string | undefined) =>
  !!key && !!secret && timingSafeEqual(sha256(key), sha256(secret));

export const GET = async (request: NextRequest) => {
  if (!isAuthorized(getKey(request), process.env.HEALTH_CHECK_SECRET)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        database: 'connected',
        region: process.env.VERCEL_REGION || 'dev',
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
      {
        headers: {
          'Cache-Control':
            'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
        status: 200,
      },
    );
  } catch (error) {
    logger.error({ error }, 'Health Check Failed');

    return NextResponse.json(
      {
        database: 'disconnected',
        status: 'error',
      },
      { status: 503 },
    );
  }
};
