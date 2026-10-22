/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

import prisma from '@/lib/prisma';

import { GET } from './route';

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: { $queryRaw: jest.fn() },
}));
jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: { error: jest.fn() },
}));

const mockQueryRaw = prisma.$queryRaw as unknown as jest.Mock;

const SECRET = 'health-secret';

const request = (headers: Record<string, string> = {}, query = '') =>
  new NextRequest(`http://localhost/api/health${query}`, { headers });

describe('GET /api/health', () => {
  const originalSecret = process.env.HEALTH_CHECK_SECRET;

  beforeEach(() => {
    process.env.HEALTH_CHECK_SECRET = SECRET;
    mockQueryRaw.mockResolvedValue([1]);
  });

  afterAll(() => {
    process.env.HEALTH_CHECK_SECRET = originalSecret;
  });

  it('accepts the secret in the Authorization header', async () => {
    const response = await GET(request({ authorization: `Bearer ${SECRET}` }));

    expect(response.status).toBe(200);
  });

  it('still accepts the secret in the query', async () => {
    const response = await GET(request({}, `?key=${SECRET}`));

    expect(response.status).toBe(200);
  });

  it.each([
    ['a wrong secret', { authorization: 'Bearer wrong' }],
    ['no secret', {}],
  ])('refuses %s', async (_, headers) => {
    const response = await GET(request(headers));

    expect(response.status).toBe(401);
  });

  it('refuses everyone when no secret is configured', async () => {
    delete process.env.HEALTH_CHECK_SECRET;

    const response = await GET(request({ authorization: 'Bearer ' }));

    expect(response.status).toBe(401);
  });

  it('does not share database errors', async () => {
    mockQueryRaw.mockRejectedValue(new Error('password authentication failed'));

    const response = await GET(request({ authorization: `Bearer ${SECRET}` }));

    expect(response.status).toBe(503);
    expect(JSON.stringify(await response.json())).not.toContain('password');
  });
});
