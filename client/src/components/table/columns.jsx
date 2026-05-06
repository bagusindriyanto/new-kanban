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
      const total_minutes = row.getValue('total_minutes');
      const formatted = formatDuration(total_minutes);
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
      const activity_count = row.getValue('activity_count');
      return (
        <div className="font-medium tabular-nums text-right">
          {activity_count}
        </div>
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
      const avg_minutes = Math.round(row.getValue('avg_minutes'));
      const formatted = formatDuration(avg_minutes);
      return (
        <div className="font-medium tabular-nums text-right">{formatted}</div>
      );
    },
  },
];
