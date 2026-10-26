'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';
import { useEffect } from 'react';

import { Chip } from '@/components/ui/Chip';
import { Skeleton } from '@/components/ui/Skeleton';
import { useHabiticaStore } from '@/store/useHabiticaStore';
import { barPercent } from '@/utils/stats';

const StatBar: FC<{
  color: string;
  label: string;
  max: number;
  value: number;
}> = ({ color, label, max, value }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex justify-between text-xs">
      <span className="font-semibold">{label}</span>
      <span className="font-mono text-white/80">
        {Math.floor(value)} / {Math.floor(max)}
      </span>
    </div>
    {/* A native meter is hard to style, so it's only for screen readers */}
    <meter
      aria-label={label}
      className="sr-only"
      max={Math.floor(max)}
      min={0}
      value={Math.floor(value)}
    />
    <div
      aria-hidden="true"
      className="h-2 overflow-hidden rounded-full bg-black/40 shadow-[inset_0_1px_2px_rgb(0_0_0/0.4)]"
    >
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{ backgroundColor: color, width: `${barPercent(value, max)}%` }}
      />
    </div>
  </div>
);

const capitalise = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export const HabiticaStatsCard: FC = () => {
  const isLoading = useHabiticaStore(state => state.isStatsLoading);
  const habiticaStats = useHabiticaStore(state => state.habiticaStats);
  const isConnected = useHabiticaStore(state => state.isHabiticaConnected);
  const fetchHabiticaStats = useHabiticaStore(
    state => state.fetchHabiticaStats,
  );
  const fetchHabiticaConnection = useHabiticaStore(
    state => state.fetchHabiticaConnection,
  );

  useEffect(() => {
    fetchHabiticaStats();
    fetchHabiticaConnection();
  }, [fetchHabiticaStats, fetchHabiticaConnection]);

  if (isLoading) {
    // Mirrors the loaded card so nothing jumps when the stats arrive
    return (
      <section
        aria-busy="true"
        aria-label="Your Habitica character"
        className="arcane flex flex-col gap-[18px] rounded-xl p-[22px]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-16 bg-white/15" />
            <Skeleton className="h-10 w-40 bg-white/15" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full bg-white/15" />
        </div>

        <div className="flex flex-col gap-3">
          {['Health', 'Experience', 'Mana'].map(label => (
            <div className="flex flex-col gap-1.5" key={label}>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20 bg-white/15" />
                <Skeleton className="h-4 w-14 bg-white/15" />
              </div>
              <Skeleton className="h-2 w-full rounded-full bg-white/15" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-1.5 border-t border-white/15 pt-3.5">
          {[0, 1, 2, 3, 4].map(index => (
            <div className="flex flex-col items-center gap-1" key={index}>
              <Skeleton className="h-3 w-8 bg-white/15" />
              <Skeleton className="h-5 w-10 bg-white/15" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!habiticaStats) {
    return (
      <section className="mist flex flex-col gap-2 rounded-xl border border-border p-5">
        <h2 className="text-[15px] font-semibold text-text">
          Link your Habitica account
        </h2>
        <p className="text-sm text-text-2">
          Add your Habitica User ID and API token to see your level and stats
          here.
        </p>
        <Link
          className="mt-1 text-sm font-semibold text-accent-text"
          href="/dashboard/settings"
        >
          Go to settings
        </Link>
      </section>
    );
  }

  const stats = [
    { label: 'STR', value: habiticaStats.str },
    { label: 'INT', value: habiticaStats.int },
    { label: 'CON', value: habiticaStats.con },
    { label: 'PER', value: habiticaStats.per },
  ];

  return (
    <section
      aria-label="Your Habitica character"
      className="arcane flex flex-col gap-[18px] rounded-xl p-[22px]"
    >
      <Image
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 -right-12 h-56 w-56 max-w-none opacity-[0.08]"
        height={224}
        src="/octogriffin_white.png"
        width={224}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] text-white/75">
            {capitalise(habiticaStats.class)}
          </span>
          <span className="font-display text-[40px] leading-none font-extrabold tracking-[-0.02em]">
            Level {habiticaStats.lvl}
          </span>
        </div>
        {isConnected && (
          <Chip
            className="border border-white/15 bg-black/40 text-white"
            dot
            shape="pill"
            tone="ok"
          >
            Linked
          </Chip>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <StatBar
          color="#ff6b7a"
          label="Health"
          max={habiticaStats.maxHealth}
          value={habiticaStats.hp}
        />
        <StatBar
          color="#f5b544"
          label="Experience"
          max={habiticaStats.toNextLevel}
          value={habiticaStats.exp}
        />
        <StatBar
          color="#6aa6ff"
          label="Mana"
          max={habiticaStats.maxMP}
          value={habiticaStats.mp}
        />
      </div>

      <dl className="grid grid-cols-5 gap-1.5 border-t border-white/15 pt-3.5">
        {stats.map(({ label, value }) => (
          <div className="flex flex-col items-center" key={label}>
            <dt className="font-mono text-[11px] text-white/65">{label}</dt>
            <dd className="text-[15px] font-bold">{Math.floor(value)}</dd>
          </div>
        ))}
        <div className="flex flex-col items-center">
          <dt className="font-mono text-[11px] text-white/65">GOLD</dt>
          <dd className="text-[15px] font-bold text-[#f5d27a]">
            {Math.floor(habiticaStats.gp).toLocaleString()}
          </dd>
        </div>
      </dl>
    </section>
  );
};
