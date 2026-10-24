import type { FC } from 'react';

export type KbdProps = {
  children: string;
};

export const Kbd: FC<KbdProps> = ({ children }) => (
  <kbd className="rounded-[4px] border border-current/25 px-1.5 font-mono text-[11px] leading-[18px] opacity-80">
    {children}
  </kbd>
);
