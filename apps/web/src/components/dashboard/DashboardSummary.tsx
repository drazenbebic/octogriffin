'use client';

import type { FC } from 'react';

import { useRepositories } from '@/hooks/useRepositories';
import { useTriggersStore } from '@/store/useTriggersStore';
import { dashboardSummary } from '@/utils/dashboardSummary';

export const DashboardSummary: FC = () => {
  const total = useTriggersStore(state => state.meta.total);
  const isLoading = useTriggersStore(state => state.isLoading);
  const repositories = useRepositories();

  if (isLoading && total === 0) {
    return <span className="block h-6" />;
  }

  return (
    <p className="text-muted">{dashboardSummary(total, repositories.length)}</p>
  );
};
