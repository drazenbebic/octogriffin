'use client';

import { useTheme } from 'next-themes';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { Moon01Icon, Sun01Icon } from '@hugeicons/core-free-icons';

import { ButtonIcon } from '@/components/ui/ButtonIcon';

export const ThemeSwitcher: FC = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

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
        label="Switch theme"
        size="md"
        variant="ghost"
      />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <ButtonIcon
      icon={isDark ? Sun01Icon : Moon01Icon}
      label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      size="md"
      variant="ghost"
    />
  );
};
