'use client';

import { useEffect } from 'react';

import { Chip } from '@/components/ui/Chip';
import { Skeleton } from '@/components/ui/Skeleton';
import { useHabiticaStore } from '@/store/useHabiticaStore';

export const IsConnected = () => {
  const { fetchHabiticaConnection, isConnectionLoading, isHabiticaConnected } =
    useHabiticaStore();

  useEffect(() => {
    fetchHabiticaConnection();
  }, [fetchHabiticaConnection]);

  if (isConnectionLoading) {
    return <Skeleton className="h-9 w-32" variant="circular" />;
  }

  return (
    <Chip dot shape="pill" tone={isHabiticaConnected ? 'ok' : 'neutral'}>
      {isHabiticaConnected ? 'Connected' : 'Not connected'}
    </Chip>
  );
};
