'use client';

import type { FC } from 'react';
import { useMemo, useState } from 'react';

import { Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import type { ComboboxItemType } from '@/components/ui/Combobox';
import { useEventIcon } from '@/hooks/useEventIcon';
import { filterEvents, getActionLabel } from '@/utils/githubEvents';

const slug = (group: string) => group.toLowerCase().replace(/\s+/g, '-');

const GroupIcon: FC<{ event: string }> = ({ event }) => (
  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-accent-soft text-accent-text">
    {useEventIcon(event, { size: 16 })}
  </span>
);

export type EventCatalogueProps = {
  events: ComboboxItemType[];
};

/** Every supported GitHub event, searchable and grouped by type. */
export const EventCatalogue: FC<EventCatalogueProps> = ({ events }) => {
  const [query, setQuery] = useState('');

  const groups = useMemo(() => {
    const byGroup = new Map<string, ComboboxItemType[]>();

    for (const event of filterEvents(events, query)) {
      const group = event.group ?? 'Other';

      byGroup.set(group, [...(byGroup.get(group) ?? []), event]);
    }

    return [...byGroup.entries()];
  }, [events, query]);

  const matches = groups.reduce((total, [, items]) => total + items.length, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="flex h-11 items-center gap-2.5 rounded-md border border-border-strong bg-surface px-3.5 text-muted shadow-e1 focus-within:border-accent focus-within:ring-[3px] focus-within:ring-ring">
          <HugeiconsIcon icon={Search01Icon} size={18} />
          <input
            aria-label="Search events"
            className="w-full bg-transparent text-[15px] text-text outline-none placeholder:text-faint"
            onChange={event => setQuery(event.target.value)}
            placeholder={`Search ${events.length} events, e.g. “review” or pull_request.opened`}
            type="search"
            value={query}
          />
        </label>
        <p aria-live="polite" className="text-[13px] text-muted">
          {query.trim()
            ? `${matches} ${matches === 1 ? 'event matches' : 'events match'} “${query.trim()}”`
            : `${events.length} events in ${groups.length} groups`}
        </p>
        {!query.trim() && (
          <nav aria-label="Event groups" className="flex flex-wrap gap-1.5">
            {groups.map(([group, items]) => (
              <a
                className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-text-2 transition-colors duration-[var(--dur-fast)] hover:border-border-strong hover:text-text"
                href={`#events-${slug(group)}`}
                key={group}
              >
                {group} <span className="text-muted">{items.length}</span>
              </a>
            ))}
          </nav>
        )}
      </div>

      {groups.map(([group, items]) => (
        <section
          aria-labelledby={`events-${slug(group)}-heading`}
          className="scroll-mt-24 overflow-hidden rounded-lg border border-border bg-surface shadow-e1"
          id={`events-${slug(group)}`}
          key={group}
        >
          <div className="flex items-center gap-3 border-b border-border bg-sunken px-4 py-3">
            <GroupIcon event={items[0].value} />
            <h3
              className="text-[15px] font-semibold text-text"
              id={`events-${slug(group)}-heading`}
            >
              {group}
            </h3>
            <span className="ml-auto text-xs text-muted">
              {items.length} {items.length === 1 ? 'event' : 'events'}
            </span>
          </div>
          <ul className="grid sm:grid-cols-2">
            {items.map(({ label, value }) => (
              <li
                className="flex flex-col gap-0.5 border-b border-line px-4 py-2.5 sm:odd:border-r"
                key={value}
              >
                <span className="text-sm font-medium text-text">
                  {getActionLabel(label, group)}
                </span>
                <code className="font-mono text-xs text-muted">{value}</code>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {groups.length === 0 && (
        <p className="rounded-lg border border-dashed border-border-strong px-6 py-10 text-center text-sm text-text-2">
          No supported event matches “{query.trim()}”.
        </p>
      )}
    </div>
  );
};
