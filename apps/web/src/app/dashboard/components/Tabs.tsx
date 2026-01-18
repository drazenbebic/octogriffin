'use client';

import { usePathname, useRouter } from 'next/navigation';

import { TabProvider, TabProviderProps } from '@ariakit/react';

export const Tabs = (props: TabProviderProps) => {
  const router = useRouter();
  const selectedId = usePathname();

  return (
    <TabProvider
      selectedId={selectedId}
      setSelectedId={id => router.push(id || selectedId)}
      {...props}
    />
  );
};
