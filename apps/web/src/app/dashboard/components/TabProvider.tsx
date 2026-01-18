'use client';

import { usePathname, useRouter } from 'next/navigation';

import {
  TabProvider as BaseTabProvider,
  TabProviderProps,
} from '@ariakit/react';

export const TabProvider = (props: TabProviderProps) => {
  const router = useRouter();
  const selectedId = usePathname();

  return (
    <BaseTabProvider
      selectedId={selectedId}
      setSelectedId={id => router.push(id || selectedId)}
      {...props}
    />
  );
};
