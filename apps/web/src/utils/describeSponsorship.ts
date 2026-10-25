import type { Currency, SponsorTier } from '@/config/sponsors';
import {
  daysOfHosting,
  formatMoney,
  upkeep,
  upkeepPercent,
} from '@/config/sponsors';
import type { TriggerSentencePart } from '@/utils/describeTrigger';

/**
 * A sponsorship written out like a trigger, for the sponsors page, with the
 * amount in the visitor's currency.
 */
export const describeSponsorship = (
  tier: SponsorTier,
  currency: Currency,
  goal = upkeep.goal,
): TriggerSentencePart[] => {
  const price = formatMoney(tier.amount, currency);

  if (tier.id === 'once') {
    const days = daysOfHosting(tier.amount, goal);

    return [
      { kind: 'text', text: 'When ' },
      { kind: 'value', text: 'you' },
      { kind: 'text', text: ' give ' },
      { kind: 'value', text: 'once' },
      { kind: 'text', text: ', Octogriffin ' },
      { kind: 'value', text: tier.effect },
      { kind: 'text', text: ', and every ' },
      { kind: 'value', text: price },
      { kind: 'text', text: ' covers about ' },
      {
        kind: 'value',
        text: days === 1 ? '1 day' : `${days} days`,
        tone: 'ok',
      },
      { kind: 'text', text: ' of hosting.' },
    ];
  }

  return [
    { kind: 'text', text: 'When ' },
    { kind: 'value', text: 'you' },
    { kind: 'text', text: ' sponsor ' },
    { kind: 'value', text: `${price} a month` },
    { kind: 'text', text: ', Octogriffin ' },
    { kind: 'value', text: tier.effect },
    { kind: 'text', text: ' and server health goes ' },
    {
      kind: 'value',
      text: `up ${upkeepPercent(tier.amount, goal)}%`,
      tone: 'ok',
    },
    { kind: 'text', text: '.' },
  ];
};
