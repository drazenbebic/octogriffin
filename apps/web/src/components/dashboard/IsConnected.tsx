'use client';

import { useEffect } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useHabiticaStore } from '@/store/useHabiticaStore';

export const IsConnected = () => {
  const { fetchHabiticaConnection, isHabiticaConnected, isLoading } =
    useHabiticaStore();

  useEffect(() => {
    fetchHabiticaConnection();
  }, [fetchHabiticaConnection]);

  if (isLoading) {
    return <Skeleton className="h-9 w-32" variant="circular" />;
  }

  return (
    <Badge
      className="px-4 py-2"
      hasDot
      pulsing={isHabiticaConnected}
      size="md"
      variant={isHabiticaConnected ? 'success' : 'neutral'}
    >
      {isHabiticaConnected ? 'Connected' : 'Not Connected'}
    </Badge>
  );
};
