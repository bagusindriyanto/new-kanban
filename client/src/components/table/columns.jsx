// This type is used to define the shape of our data.
import { MoreHorizontal } from 'lucide-react';
import { ArrowUpDown } from 'lucide-react';

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
    accessorKey: 'date',
    header: 'Tanggal',
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'));
      const formatted = date.toLocaleDateString('id');
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'name',
    header: 'PIC',
  },
  {
    accessorKey: 'content',
    header: 'Aktivitas',
  },
  {
    accessorKey: 'total_minutes',
    header: () => <div className="text-right">Total Durasi</div>,
    cell: ({ row }) => {
      const total_minutes = row.getValue('total_minutes');
      const formatted = total_minutes + ' menit';
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'activity_count',
    header: () => <div className="text-right">Jumlah</div>,
    cell: ({ row }) => {
      const activity_count = row.getValue('activity_count');
      return <div className="text-right font-medium">{activity_count}</div>;
    },
  },
  {
    accessorKey: 'avg_minutes',
    header: () => <div className="text-right">Rata-Rata Durasi</div>,
    cell: ({ row }) => {
      const avg_minutes = parseFloat(row.getValue('avg_minutes')).toFixed(1);
      const formatted = avg_minutes + ' menit';
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
];
