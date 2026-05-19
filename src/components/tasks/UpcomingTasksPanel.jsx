import { parseFromSQL } from '@/utils/formatTimestamp';
import { BellRingIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUrgencyCheck } from './useUrgencyCheck';
import useDeadlineChecker from '@/hooks/useDeadlineChecker';
import { useFetchUpcomingTasks } from '@/api/fetchUpcomingTasks';

const UpcomingTaskCard = ({ task }) => {
  const { isUrgent, diffInMinutes } = useUrgencyCheck({
    status: task.status,
    scheduled_at: task.scheduled_at,
  });
  const picName = task.pic_name;

  return (
    <div
      key={task.id}
      className={cn('p-3 space-y-2 text-sm rounded-lg border bg-card', {
        'bg-red-50 dark:bg-red-950/30': isUrgent,
      })}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-base font-bold leading-tight line-clamp-2">
          {task.content}
        </h3>
        <p className="text-sm font-semibold">{picName}</p>
      </div>
      <p className="text-xs tabular-nums text-muted-foreground">
        {parseFromSQL(task.scheduled_at)}
      </p>
      <div className="flex justify-between items-center mt-1">
        <p
          className={cn('text-xs font-semibold', {
            'text-red-600 dark:text-red-400': isUrgent,
            'text-blue-600 dark:text-blue-400': !isUrgent,
          })}
        >
          {Math.ceil(diffInMinutes)} menit lagi
        </p>
        {isUrgent && (
          <div className="mt-1 bg-red-500 rounded-full animate-pulse shrink-0 size-2"></div>
        )}
      </div>
    </div>
  );
};

const UpcomingTasksPanel = () => {
  const { data: upcomingTasks } = useFetchUpcomingTasks();

  const visibleTasks = upcomingTasks
    ?.filter((task) => {
      const diffInMinutes = (new Date(task.scheduled_at) - new Date()) / 60000;
      return diffInMinutes > 0 && diffInMinutes <= 30;
    })
    .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));

  useDeadlineChecker(upcomingTasks);

  return (
    <Sheet>
      <Tooltip>
        <TooltipTrigger
          render={
            <SheetTrigger
              nativeButton={false}
              render={<div className="relative w-fit" />}
            />
          }
        >
          <Button variant="outline" size="icon">
            <BellRingIcon />
          </Button>
          {visibleTasks && visibleTasks?.length > 0 && (
            <Badge className="absolute -top-1 -right-1 size-4 tabular-nums p-0 bg-red-300 text-red-700 dark:bg-red-700 dark:text-red-300">
              {visibleTasks.length > 9 ? '9+' : visibleTasks.length}
            </Badge>
          )}
        </TooltipTrigger>
        <TooltipContent>Task yang Akan Dimulai</TooltipContent>
      </Tooltip>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Task yang Akan Dimulai</SheetTitle>
          <SheetDescription>
            Menampilkan task yang akan dimulai dalam 30 menit ke depan.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 min-h-0">
          <div className="px-4 space-y-3 pb-4">
            {visibleTasks?.map((task) => (
              <UpcomingTaskCard key={task.id} task={task} />
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default UpcomingTasksPanel;
