// data-table-pagination.tsx
import { Button } from '@/components/ui/button';
import type { Table as TanstackTable } from '@tanstack/react-table';
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';

interface DataTablePaginationProps<TData> {
  table: TanstackTable<TData>;
}

export const DataTablePagination = <TData,>({
  table,
}: DataTablePaginationProps<TData>) => {
  return (
    <div className="flex gap-x-6 justify-end items-center mt-4">
      <div className="flex justify-center items-center text-sm font-medium w-fit">
        Halaman{' '}
        {table.getPageCount() === 0
          ? 0
          : table.getState().pagination.pageIndex + 1}{' '}
        dari {table.getPageCount()}
      </div>
      <div className="flex gap-2 items-center ml-auto lg:ml-0">
        <Button
          variant="outline"
          className="size-8"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Halaman Awal</span>
          <ChevronFirstIcon />
        </Button>
        <Button
          variant="outline"
          className="size-8"
          size="icon"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Halaman Sebelumnya</span>
          <ChevronLeftIcon />
        </Button>
        <Button
          variant="outline"
          className="size-8"
          size="icon"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Halaman Berikutnya</span>
          <ChevronRightIcon />
        </Button>
        <Button
          variant="outline"
          className="size-8"
          size="icon"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Halaman Terakhir</span>
          <ChevronLastIcon />
        </Button>
      </div>
    </div>
  );
};
