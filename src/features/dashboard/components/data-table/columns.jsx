import { ArrowUpIcon, ArrowDownIcon, ChevronsUpDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDuration } from '@/utils/formatDuration';
import UserAvatar from '@/components/shared/UserAvatar';

export const columns = [
  {
    accessorKey: 'user',
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === 'asc')}
        >
          PIC
          {!isSorted && <ChevronsUpDownIcon className="ml-0.5 size-4" />}
          {isSorted === 'asc' && <ArrowUpIcon className="ml-0.5 size-4" />}
          {isSorted === 'desc' && <ArrowDownIcon className="ml-0.5 size-4" />}
        </Button>
      );
    },
    sortingFn: (rowA, rowB) => {
      const nameA = rowA.original.user.profile.full_name;
      const nameB = rowB.original.user.profile.full_name;
      return nameA.localeCompare(nameB);
    },
    cell: ({ getValue }) => {
      const { profile, role } = getValue();
      return (
        <div className="flex items-center gap-3">
          <UserAvatar profile={profile} />
          <div className="min-w-0 flex-1">
            <div className="font-medium truncate">{profile.full_name}</div>
            <div className="text-sm text-muted-foreground truncate">{role}</div>
          </div>
        </div>
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
          {!isSorted && <ChevronsUpDownIcon className="ml-0.5 size-4" />}
          {isSorted === 'asc' && <ArrowUpIcon className="ml-0.5 size-4" />}
          {isSorted === 'desc' && <ArrowDownIcon className="ml-0.5 size-4" />}
        </Button>
      );
    },
  },
  {
    accessorKey: 'avg_effective_minute',
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === 'asc')}
        >
          Rata-Rata Durasi
          {!isSorted && <ChevronsUpDownIcon className="ml-0.5 size-4" />}
          {isSorted === 'asc' && <ArrowUpIcon className="ml-0.5 size-4" />}
          {isSorted === 'desc' && <ArrowDownIcon className="ml-0.5 size-4" />}
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const avgEffectiveMinute = Math.round(getValue());
      const formatted = formatDuration(avgEffectiveMinute);
      return (
        <div className="font-medium tabular-nums text-right">{formatted}</div>
      );
    },
  },
  {
    accessorKey: 'sum_effective_minute',
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === 'asc')}
        >
          Total Durasi
          {!isSorted && <ChevronsUpDownIcon className="ml-0.5 size-4" />}
          {isSorted === 'asc' && <ArrowUpIcon className="ml-0.5 size-4" />}
          {isSorted === 'desc' && <ArrowDownIcon className="ml-0.5 size-4" />}
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const sumEffectiveMinute = getValue();
      const formatted = formatDuration(sumEffectiveMinute);
      return (
        <div className="text-muted-foreground tabular-nums text-right">
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: 'tasks_count',
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === 'asc')}
        >
          Jumlah
          {!isSorted && <ChevronsUpDownIcon className="ml-0.5 size-4" />}
          {isSorted === 'asc' && <ArrowUpIcon className="ml-0.5 size-4" />}
          {isSorted === 'desc' && <ArrowDownIcon className="ml-0.5 size-4" />}
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const tasksCount = getValue();
      return (
        <div className="text-muted-foreground tabular-nums text-right">
          {tasksCount}
        </div>
      );
    },
  },
];
