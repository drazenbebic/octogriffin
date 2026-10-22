'use client';

import { SessionProvider } from 'next-auth/react';
import type { FC, ReactNode } from 'react';

export type NavigationUserProps = {
  children?: ReactNode;
};

export const NavigationUser: FC<NavigationUserProps> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
