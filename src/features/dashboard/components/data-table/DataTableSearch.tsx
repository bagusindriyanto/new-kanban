// data-table-search.tsx
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import type { ReactTable, RowData } from '@tanstack/react-table';
import { SearchIcon } from 'lucide-react';
import type { DataTableFeatures } from './features';

type DataTableSearchProps<TData extends RowData> = {
  table: ReactTable<DataTableFeatures, TData>;
  columnId: string; // kolom mana yang mau di-search
  placeholder?: string;
};

const DataTableSearch = <TData extends RowData>({
  table,
  columnId,
  placeholder = 'Cari...',
}: DataTableSearchProps<TData>) => {
  const column = table.getColumn(columnId);

  if (!column) return null;

  return (
    <InputGroup className="max-w-sm">
      <InputGroupInput
        placeholder={placeholder}
        value={(column.getFilterValue() as string) ?? ''}
        onChange={(event) => column.setFilterValue(event.target.value)}
      />
      <InputGroupAddon align="inline-end">
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  );
};

export default DataTableSearch;
