import { FC } from 'react';

import { Button } from '@ariakit/react';
import clsx from 'clsx';
import { ArrowLeft01Icon, ArrowRight01Icon } from 'hugeicons-react';

import { PaginationMeta } from '@/types/pagination';

export type PaginationProps = {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  className?: string;
};

export const Pagination: FC<PaginationProps> = ({
  meta,
  onPageChange,
  onLimitChange,
  className,
}) => {
  const { page, totalPages, total, limit } = meta;
  const hasPrev = page > 1;
  const hasNext = page < totalPages;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  if (total === 0) {
    return null;
  }

  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-between gap-4 border-t border-slate-100 py-4 sm:flex-row',
        className,
      )}
    >
      <div className="flex items-center gap-4 text-sm text-slate-500">
        <div>
          Showing <span className="font-medium text-slate-900">{start}</span> to{' '}
          <span className="font-medium text-slate-900">{end}</span> of{' '}
          <span className="font-medium text-slate-900">{total}</span> results
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="mr-2 flex items-center gap-2 text-sm text-slate-500">
          <span className="hidden sm:inline">Rows per page:</span>
          <select
            value={limit}
            onChange={e => onLimitChange(Number(e.target.value))}
            className="cursor-pointer rounded-lg border border-slate-200 bg-white py-1.5 pl-2 pr-8 text-sm font-medium text-slate-700 hover:border-slate-300 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            {[5, 10, 20, 50, 100].map(val => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>

        <Button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev}
          className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:pointer-events-none"
        >
          <ArrowLeft01Icon size={16} />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <div className="text-sm font-medium text-slate-600">
          <span className="sm:hidden">
            {page} / {totalPages}
          </span>
          <span className="hidden sm:inline">
            Page {page} of {totalPages}
          </span>
        </div>

        <Button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:pointer-events-none"
        >
          <span className="hidden sm:inline">Next</span>
          <ArrowRight01Icon size={16} />
        </Button>
      </div>
    </div>
  );
};
