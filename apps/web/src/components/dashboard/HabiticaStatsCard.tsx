'use client';

import { FC, useEffect, useMemo } from 'react';

import { Card } from '@/components/ui/Card';
import { CardBody } from '@/components/ui/CardBody';
import { Heading } from '@/components/ui/Heading';
import { Skeleton } from '@/components/ui/Skeleton';
import { useHabiticaStore } from '@/store/useHabiticaStore';

export const HabiticaStatsCard: FC = () => {
  const isLoading = useHabiticaStore(state => state.isLoading);
  const habiticaStats = useHabiticaStore(state => state.habiticaStats);
  const fetchHabiticaStats = useHabiticaStore(
    state => state.fetchHabiticaStats,
  );

  useEffect(() => {
    fetchHabiticaStats();
  }, [fetchHabiticaStats]);

  const progress = useMemo(() => {
    if (!habiticaStats) {
      return 0;
    }

    return Math.min((habiticaStats.exp / habiticaStats.toNextLevel) * 100, 100);
  }, [habiticaStats]);

  if (isLoading) {
    return (
      <Card
        variant="flat"
        className="bg-violet-600 text-white shadow-lg shadow-violet-900/20"
      >
        <CardBody>
          <div className="flex items-start justify-between">
            <Skeleton className="h-5 w-24 bg-white/20" />
            <Skeleton className="h-6 w-20 rounded-full bg-white/20" />
          </div>

          <div className="mt-4 flex items-end gap-2">
            <Skeleton className="h-10 w-16 bg-white/20" />
            <Skeleton className="mb-1.5 h-4 w-6 bg-white/20" />
          </div>

          <Skeleton className="mt-4 h-2.5 w-full rounded-full bg-white/20" />

          <div className="mt-2 flex justify-between">
            <Skeleton className="h-4 w-12 bg-white/20" />
            <Skeleton className="h-4 w-20 bg-white/20" />
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!habiticaStats) {
    return (
      <Card variant="flat" className="bg-slate-100 text-slate-500">
        <CardBody className="flex flex-col items-center justify-center py-8 text-center">
          <Heading level={3} size="base" className="mb-2 text-slate-700">
            No Data Available
          </Heading>
          <p className="text-xs">
            Connect your Habitica account to view your level and progress.
          </p>
        </CardBody>
      </Card>
    );
  }

  const xp = Math.floor(habiticaStats.exp);
  const toNextLevel = habiticaStats.toNextLevel;
  const hp = Math.ceil(habiticaStats.hp);
  const maxHealth = habiticaStats.maxHealth;
  const lvl = habiticaStats.lvl;

  return (
    <Card
      variant="flat"
      className="bg-violet-600 text-white shadow-violet-900/20 shadow-lg"
    >
      <CardBody>
        <div className="flex items-start justify-between">
          <Heading level={3} size="base" className="text-white/90">
            Current Level
          </Heading>

          <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-1 text-[10px] font-medium backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400"></span>
            {hp} / {maxHealth} HP
          </div>
        </div>

        <div className="mt-4 flex items-end gap-2">
          <span className="text-4xl font-bold tracking-tight">{lvl}</span>
          <span className="mb-1.5 font-medium text-violet-200">Lvl</span>
        </div>

        <div className="relative mt-4 h-2.5 w-full overflow-hidden rounded-full bg-violet-900/50">
          <div
            className="h-full rounded-full bg-linear-to-r from-white/90 to-white transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-2 flex justify-between text-xs font-medium text-violet-200">
          <span>{xp} XP</span>
          <span>{toNextLevel} XP to next</span>
        </div>
      </CardBody>
    </Card>
  );
};
