import prisma from '@/lib/prisma';

import { prismaTriggerCooldowns } from './prismaTriggerCooldowns';

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: { triggers: { updateMany: jest.fn() } },
}));

const updateMany = prisma.triggers.updateMany as jest.Mock;

const now = new Date('2026-10-24T10:00:00.000Z');
const previous = new Date('2026-10-24T09:00:00.000Z');

describe('prismaTriggerCooldowns', () => {
  beforeEach(() => updateMany.mockReset());

  it('claims a trigger nobody claimed since it was read', async () => {
    updateMany.mockResolvedValue({ count: 1 });

    await expect(
      prismaTriggerCooldowns.claim('trigger-1', previous, now),
    ).resolves.toBe(true);
    expect(updateMany).toHaveBeenCalledWith({
      data: { lastScoredAt: now },
      where: { lastScoredAt: previous, uuid: 'trigger-1' },
    });
  });

  it('claims a trigger that never scored', async () => {
    updateMany.mockResolvedValue({ count: 1 });

    await prismaTriggerCooldowns.claim('trigger-1', null, now);

    expect(updateMany).toHaveBeenCalledWith({
      data: { lastScoredAt: now },
      where: { lastScoredAt: null, uuid: 'trigger-1' },
    });
  });

  it('loses the claim to a delivery that got there first', async () => {
    updateMany.mockResolvedValue({ count: 0 });

    await expect(
      prismaTriggerCooldowns.claim('trigger-1', previous, now),
    ).resolves.toBe(false);
  });

  it('releases only its own claim', async () => {
    updateMany.mockResolvedValue({ count: 1 });

    await prismaTriggerCooldowns.release('trigger-1', now, previous);

    expect(updateMany).toHaveBeenCalledWith({
      data: { lastScoredAt: previous },
      where: { lastScoredAt: now, uuid: 'trigger-1' },
    });
  });
});
