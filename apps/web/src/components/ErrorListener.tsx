'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { errorMap } from '@/components/errorMap';

const Listener = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const error = searchParams.get('error');

  useEffect(() => {
    if (error && error in errorMap) {
      const handler = errorMap[error as keyof typeof errorMap];

      handler();

      const params = new URLSearchParams(searchParams.toString());

      params.delete('error');

      const newQuery = params.toString();
      const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;

      router.replace(newUrl);
    }
  }, [error, router, pathname, searchParams]);

  return null;
};

export const ErrorListener = () => {
  return (
    <Suspense fallback={null}>
      <Listener />
    </Suspense>
  );
};
