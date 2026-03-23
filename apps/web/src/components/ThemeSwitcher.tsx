'use client';

import { FC, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

import { Moon01Icon, Sun01Icon } from 'hugeicons-react';

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
        icon={Sun01Icon}
        variant="ghost"
        size="md"
        className="opacity-0"
        disabled
      />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <ButtonIcon
      icon={isDark ? Sun01Icon : Moon01Icon}
      variant="ghost"
      size="md"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
    />
  );
};
