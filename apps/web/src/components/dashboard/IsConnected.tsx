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
    return <Skeleton variant="circular" className="h-9 w-32" />;
  }

  return (
    <Badge
      variant={isHabiticaConnected ? 'success' : 'neutral'}
      size="md"
      hasDot
      pulsing={isHabiticaConnected}
      className="px-4 py-2"
    >
      {isHabiticaConnected ? 'Connected' : 'Not Connected'}
    </Badge>
  );
};
