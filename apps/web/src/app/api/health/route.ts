import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import logger from '@/lib/logger';
import prisma from '@/lib/prisma';

export const GET = async (request: NextRequest) => {
  const key = request.nextUrl.searchParams.get('key');
  const secret = process.env.HEALTH_CHECK_SECRET;

  if (!secret || key !== secret) {
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
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
      },
      { status: 503 },
    );
  }
};
