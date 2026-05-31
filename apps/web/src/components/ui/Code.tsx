import React, { FC } from 'react';

import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react';
import { BundledLanguage } from 'shiki';

import { cn } from '@/utils/cn';
import { codeToHtml } from '@/utils/shiki';

export type CodeProps = {
  code: string[];
  className?: string;
  language: BundledLanguage;
  disableNumbers?: boolean;
  icon?: IconSvgElement;
};

export const Code: FC<CodeProps> = async ({
  code,
  className,
  language = 'javascript',
  disableNumbers = false,
  icon,
}) => {
  const trimmed = code.join(`\n`).trim();
  const out = await codeToHtml({ code: trimmed, language });

  return (
    <div
      className={cn(
        'relative flex gap-3 items-center rounded-xl bg-slate-900 p-4 font-mono text-sm text-slate-300 space-y-2',
        {
          'disable-lines': disableNumbers,
        },
        className,
      )}
    >
      {!!icon && (
        <HugeiconsIcon icon={icon} className="m-0 shrink-0" size={20} />
      )}
      <div
        className="w-full [&_>_pre]:bg-transparent!"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: out }}
      />
    </div>
  );
};
