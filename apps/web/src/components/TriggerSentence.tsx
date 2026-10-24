import type { FC } from 'react';

import { AttributeChip } from '@/components/ui/AttributeChip';
import { cn } from '@/utils/cn';
import type { TriggerSentencePart } from '@/utils/describeTrigger';

export type TriggerSentenceProps = {
  className?: string;
  parts: TriggerSentencePart[];
  size?: 'lg' | 'md' | 'sm';
};

const sizes = {
  lg: 'font-display text-[22px] leading-[1.75] font-semibold tracking-[-0.01em] sm:text-[26px]',
  md: 'text-[15px] leading-[1.7]',
  sm: 'text-sm leading-[1.8]',
};

/** A trigger written out as a sentence, with each value highlighted. */
export const TriggerSentence: FC<TriggerSentenceProps> = ({
  className,
  parts,
  size = 'md',
}) => (
  <p
    className={cn('text-pretty text-text-2', sizes[size], className)}
    data-testid="trigger-sentence"
  >
    {parts.map((part, index) => {
      switch (part.kind) {
        case 'attribute':
          return (
            <AttributeChip
              attribute={part.attribute}
              className={
                size === 'lg' ? 'align-middle text-[0.62em]' : undefined
              }
              key={index}
            />
          );
        case 'difficulty':
          return (
            <strong className="font-semibold text-text" key={index}>
              {part.label}{' '}
              <span aria-hidden="true" className="text-xp">
                {part.stars ? '★'.repeat(part.stars) : '·'}
              </span>
            </strong>
          );
        case 'event':
          return (
            <code
              className={cn(
                'rounded-sm bg-fill px-1.5 py-0.5 font-mono text-text',
                size === 'lg' ? 'text-[0.7em]' : 'text-[0.87em]',
              )}
              key={index}
            >
              {part.text}
            </code>
          );
        case 'placeholder':
          return (
            <span className="text-faint italic" key={index}>
              {part.text}
            </span>
          );
        case 'value':
          return (
            <strong
              className={cn(
                'font-semibold',
                part.tone === 'ok' && 'text-ok',
                part.tone === 'hp' && 'text-hp',
                !part.tone && 'text-text',
              )}
              key={index}
            >
              {part.text}
            </strong>
          );
        default:
          return <span key={index}>{part.text}</span>;
      }
    })}
  </p>
);
