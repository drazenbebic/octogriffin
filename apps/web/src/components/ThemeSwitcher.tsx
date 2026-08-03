'use client';

import { useTheme } from 'next-themes';
import { FC, useEffect, useState } from 'react';

import { Moon01Icon, Sun01Icon } from '@hugeicons/core-free-icons';

import { ButtonIcon } from '@/components/ui/ButtonIcon';

export const ThemeSwitcher: FC = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <ButtonIcon
        className="opacity-0"
        disabled
        icon={Sun01Icon}
        size="md"
        variant="ghost"
      />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <ButtonIcon
      aria-label="Toggle theme"
      className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      icon={isDark ? Sun01Icon : Moon01Icon}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      size="md"
      variant="ghost"
    />
  );
};
