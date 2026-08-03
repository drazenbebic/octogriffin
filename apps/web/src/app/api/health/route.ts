import { NextRequest, NextResponse } from 'next/server';

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
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        region: process.env.VERCEL_REGION || 'dev',
      },
      {
        status: 200,
        headers: {
          'Cache-Control':
            'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      },
    );
  } catch (error) {
    logger.error({ error }, 'Health Check Failed');

    return NextResponse.json(
      {
        status: 'error',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 },
    );
  }
};
