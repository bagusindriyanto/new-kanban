// This type is used to define the shape of our data.
import { MoreHorizontal } from 'lucide-react';
import { ArrowUp, ArrowDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// You can use a Zod schema here if you want.
export const columns = [
  {
    accessorKey: 'content',
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === 'asc')}
        >
          Aktivitas
          {isSorted === 'asc' && <ArrowUp className="ml-0.5 size-4" />}
          {isSorted === 'desc' && <ArrowDown className="ml-0.5 size-4" />}
        </Button>
      );
    },
  },
  {
    accessorKey: 'total_minutes',
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === 'asc')}
        >
          Total Durasi
          {isSorted === 'asc' && <ArrowUp className="ml-0.5 size-4" />}
          {isSorted === 'desc' && <ArrowDown className="ml-0.5 size-4" />}
        </Button>
      );
    },
    cell: ({ row }) => {
      const total_minutes = row.getValue('total_minutes');
      const formatted = total_minutes + ' menit';
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'activity_count',
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === 'asc')}
        >
          Jumlah
          {isSorted === 'asc' && <ArrowUp className="ml-0.5 size-4" />}
          {isSorted === 'desc' && <ArrowDown className="ml-0.5 size-4" />}
        </Button>
      );
    },
    cell: ({ row }) => {
      const activity_count = row.getValue('activity_count');
      return <div className="text-right font-medium">{activity_count}</div>;
    },
  },
  {
    accessorKey: 'avg_minutes',
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === 'asc')}
        >
          Rata-Rata Durasi
          {isSorted === 'asc' && <ArrowUp className="ml-0.5 size-4" />}
          {isSorted === 'desc' && <ArrowDown className="ml-0.5 size-4" />}
        </Button>
      );
    },
    cell: ({ row }) => {
      const avg_minutes = parseFloat(row.getValue('avg_minutes')).toFixed(1);
      const formatted = avg_minutes + ' menit';
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
];
