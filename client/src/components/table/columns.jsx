import { ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDuration } from '@/utils/formatDuration';

export const columns = [
  {
    accessorKey: 'pic_name',
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === 'asc')}
        >
          PIC
          {isSorted === 'asc' && <ArrowUp className="ml-0.5 size-4" />}
          {isSorted === 'desc' && <ArrowDown className="ml-0.5 size-4" />}
        </Button>
      );
    },
  },
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
      const totalMinutes = row.getValue('total_minutes');
      const formatted = formatDuration(totalMinutes);
      return (
        <div className="font-medium tabular-nums text-right">{formatted}</div>
      );
    },
  },
  {
    accessorKey: 'total_tasks',
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
      const totalTasks = row.getValue('total_tasks');
      return (
        <div className="font-medium tabular-nums text-right">{totalTasks}</div>
      );
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
      const avgMinutes = Math.round(row.getValue('avg_minutes'));
      const formatted = formatDuration(avgMinutes);
      return (
        <div className="font-medium tabular-nums text-right">{formatted}</div>
      );
    },
  },
];
