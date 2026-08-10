import {
  useTable,
  type ColumnDef,
  type RowData,
  type SortingState,
  type ColumnFiltersState,
  type ColumnVisibilityState,
} from '@tanstack/react-table';
import { features, type DataTableFeatures } from './features';
import { useState } from 'react';

type UseDataTableProps<TData extends RowData> = {
  data: TData[];
  columns: ColumnDef<DataTableFeatures, TData>[];
};

export const useDataTable = <TData extends RowData>({
  data,
  columns,
}: UseDataTableProps<TData>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<ColumnVisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useTable({
    data,
    columns,
    features,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return table;
};
