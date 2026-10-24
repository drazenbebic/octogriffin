import prisma from '@/lib/prisma';

import { prismaTriggerCaps } from './prismaTriggerCaps';

const tx = {
  $queryRaw: jest.fn(),
  triggers: { update: jest.fn() },
};

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    $transaction: jest.fn(),
    triggers: { updateMany: jest.fn() },
  },
}));

const transaction = prisma.$transaction as jest.Mock;
const updateMany = prisma.triggers.updateMany as jest.Mock;

const day = '2026-10-24';

const row = (
  dailyCap: null | number,
  capDay: null | string,
  capCount: number,
) => [{ cap_count: capCount, cap_day: capDay, daily_cap: dailyCap }];

describe('prismaTriggerCaps', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    transaction.mockImplementation(callback => callback(tx));
  });

  it('grants everything on a new day', async () => {
    tx.$queryRaw.mockResolvedValue(row(10, '2026-10-23', 9));

    await expect(prismaTriggerCaps.claim('trigger-1', day, 7)).resolves.toBe(7);
    expect(tx.triggers.update).toHaveBeenCalledWith({
      data: { capCount: 7, capDay: day },
      where: { uuid: 'trigger-1' },
    });
  });

  it('grants what is left today', async () => {
    tx.$queryRaw.mockResolvedValue(row(10, day, 7));

    await expect(prismaTriggerCaps.claim('trigger-1', day, 5)).resolves.toBe(3);
    expect(tx.triggers.update).toHaveBeenCalledWith({
      data: { capCount: 10, capDay: day },
      where: { uuid: 'trigger-1' },
    });
  });

  it('grants nothing once the cap is reached', async () => {
    tx.$queryRaw.mockResolvedValue(row(10, day, 10));

    await expect(prismaTriggerCaps.claim('trigger-1', day, 1)).resolves.toBe(0);
    expect(tx.triggers.update).not.toHaveBeenCalled();
  });

  it('grants nothing when the cap was lowered below today', async () => {
    tx.$queryRaw.mockResolvedValue(row(5, day, 8));

    await expect(prismaTriggerCaps.claim('trigger-1', day, 2)).resolves.toBe(0);
    expect(tx.triggers.update).not.toHaveBeenCalled();
  });

  it('grants everything when the cap was cleared, and still counts', async () => {
    tx.$queryRaw.mockResolvedValue(row(null, day, 4));

    await expect(prismaTriggerCaps.claim('trigger-1', day, 3)).resolves.toBe(3);
    expect(tx.triggers.update).toHaveBeenCalledWith({
      data: { capCount: 7, capDay: day },
      where: { uuid: 'trigger-1' },
    });
  });

  it('grants nothing for a trigger that no longer exists', async () => {
    tx.$queryRaw.mockResolvedValue([]);

    await expect(prismaTriggerCaps.claim('trigger-1', day, 3)).resolves.toBe(0);
  });

  it('locks the trigger while it counts', async () => {
    tx.$queryRaw.mockResolvedValue(row(10, day, 0));

    await prismaTriggerCaps.claim('trigger-1', day, 1);

    const [strings] = tx.$queryRaw.mock.calls[0];

    expect(strings.join('')).toContain('FOR UPDATE');
  });

  it('gives back unused scores on the same day', async () => {
    await prismaTriggerCaps.release('trigger-1', day, 4);

    expect(updateMany).toHaveBeenCalledWith({
      data: { capCount: { decrement: 4 } },
      where: { capCount: { gte: 4 }, capDay: day, uuid: 'trigger-1' },
    });
  });

  it('gives back nothing for no scores', async () => {
    await prismaTriggerCaps.release('trigger-1', day, 0);

    expect(updateMany).not.toHaveBeenCalled();
  });
});
