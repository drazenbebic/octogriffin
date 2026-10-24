import type { FC } from 'react';
import React from 'react';

import type { IconSvgElement } from '@hugeicons/react';
import { HugeiconsIcon } from '@hugeicons/react';
import type { BundledLanguage } from 'shiki';

import { cn } from '@/utils/cn';
import { codeToHtml } from '@/utils/shiki';

export type CodeProps = {
  className?: string;
  code: string[];
  disableNumbers?: boolean;
  icon?: IconSvgElement;
  language: BundledLanguage;
};

export const Code: FC<CodeProps> = async ({
  className,
  code,
  disableNumbers = false,
  icon,
  language = 'javascript',
}) => {
  const trimmed = code.join(`\n`).trim();
  const out = await codeToHtml({ code: trimmed, language });

  return (
    <div
      className={cn(
        'relative flex items-center gap-3 space-y-2 rounded-lg border border-border bg-sunken p-4 font-mono text-sm text-text-2',
        {
          'disable-lines': disableNumbers,
        },
        className,
      )}
    >
      {!!icon && (
        <HugeiconsIcon className="m-0 shrink-0" icon={icon} size={20} />
      )}
      <div
        className="w-full [&_>_pre]:bg-transparent!"
        dangerouslySetInnerHTML={{ __html: out }}
        suppressHydrationWarning
      />
    </div>
  );
};
