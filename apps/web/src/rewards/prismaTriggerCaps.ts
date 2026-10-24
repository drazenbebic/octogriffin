import prisma from '@/lib/prisma';

import type { TriggerCaps } from './types';

type CapRow = {
  cap_count: number;
  cap_day: null | string;
  daily_cap: null | number;
};

export const prismaTriggerCaps: TriggerCaps = {
  claim: (uuid, day, wanted) =>
    prisma.$transaction(async tx => {
      // Locks the row, so deliveries arriving together count one at a time
      const [row] = await tx.$queryRaw<CapRow[]>`
        SELECT daily_cap, cap_day, cap_count FROM triggers
        WHERE uuid = ${uuid}
        FOR UPDATE
      `;

      if (!row) {
        return 0;
      }

      // A new Habitica day starts from nothing
      const used = row.cap_day === day ? row.cap_count : 0;

      // A cap cleared since it was read limits nothing, but still counts, so
      // giving back stays consistent
      const granted =
        row.daily_cap === null
          ? wanted
          : Math.max(0, Math.min(wanted, row.daily_cap - used));

      if (granted > 0) {
        await tx.triggers.update({
          data: { capCount: used + granted, capDay: day },
          where: { uuid },
        });
      }

      return granted;
    }),
  release: async (uuid, day, count) => {
    if (count <= 0) {
      return;
    }

    await prisma.triggers.updateMany({
      data: { capCount: { decrement: count } },
      where: { capCount: { gte: count }, capDay: day, uuid },
    });
  },
};
