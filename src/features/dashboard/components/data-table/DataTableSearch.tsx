// data-table-search.tsx
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import type { Table as TanstackTable } from '@tanstack/react-table';
import { SearchIcon } from 'lucide-react';

type DataTableSearchProps<TData> = {
  table: TanstackTable<TData>;
  columnId: string; // kolom mana yang mau di-search
  placeholder?: string;
};

const DataTableSearch = <TData,>({
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
