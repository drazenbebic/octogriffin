import type { FC } from 'react';

import { Button } from '@ariakit/react';
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import type { PaginationMeta } from '@/types/pagination';
import { cn } from '@/utils/cn';

export type PaginationProps = {
  className?: string;
  meta: PaginationMeta;
  onLimitChange: (limit: number) => void;
  onPageChange: (page: number) => void;
};

export const Pagination: FC<PaginationProps> = ({
  className,
  meta,
  onLimitChange,
  onPageChange,
}) => {
  const { limit, page, total, totalPages } = meta;
  const hasPrev = page > 1;
  const hasNext = page < totalPages;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  if (total === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-between gap-4 border-t border-line py-4 sm:flex-row ',
        className,
      )}
    >
      <div className="flex items-center gap-4 text-sm text-muted ">
        <div>
          Showing <span className="font-medium text-text ">{start}</span> to{' '}
          <span className="font-medium text-text ">{end}</span> of{' '}
          <span className="font-medium text-text ">{total}</span> results
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="mr-2 flex items-center gap-2 text-sm text-muted ">
          <span className="hidden sm:inline">Rows per page:</span>
          <select
            className="cursor-pointer rounded-lg border border-border bg-surface py-1.5 pl-2 pr-8 text-sm font-medium text-text-2 hover:border-border-strong focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent "
            onChange={e => onLimitChange(Number(e.target.value))}
            value={limit}
          >
            {[5, 10, 20, 50, 100].map(val => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>

        <Button
          className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-2 transition-colors hover:bg-sunken hover:text-text disabled:opacity-50 disabled:pointer-events-none "
          disabled={!hasPrev}
          onClick={() => onPageChange(page - 1)}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <div className="text-sm font-medium text-text-2 ">
          <span className="sm:hidden">
            {page} / {totalPages}
          </span>
          <span className="hidden sm:inline">
            Page {page} of {totalPages}
          </span>
        </div>

        <Button
          className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-2 transition-colors hover:bg-sunken hover:text-text disabled:opacity-50 disabled:pointer-events-none "
          disabled={!hasNext}
          onClick={() => onPageChange(page + 1)}
        >
          <span className="hidden sm:inline">Next</span>
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
        </Button>
      </div>
    </div>
  );
};
