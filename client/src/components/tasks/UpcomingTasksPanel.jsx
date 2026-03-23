import { useEffect, useState } from 'react';
import { parseFromSQL } from '@/utils/formatTimestamp';
import { BellRing } from 'lucide-react';
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
import { useFetchTasks } from '@/api/fetchTasks';
import useTaskFilters from '@/hooks/useTaskFilters';

const UpcomingTasksPanel = () => {
  const [visibleTasks, setVisibleTasks] = useState([]);
  const [localTick, setLocalTick] = useState(0);

  const { queryParams } = useTaskFilters();
  const { data: tasks } = useFetchTasks(queryParams);

  useEffect(() => {
    // Tick local timer every minute
    const tickInterval = setInterval(() => {
      setLocalTick((prev) => prev + 1);
    }, 60000);
    return () => clearInterval(tickInterval);
  }, []);

  useEffect(() => {
    if (!tasks || tasks.length === 0) {
      setVisibleTasks([]);
      return;
    }

    const upcoming = tasks
      .filter((task) => {
        if (task.status !== 'todo' || !task.scheduled_at) return false;

        const diffInMinutes =
          (new Date(task.scheduled_at) - new Date()) / 60000;

        return diffInMinutes > 0 && diffInMinutes <= 30;
      })
      .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));

    setVisibleTasks(upcoming);
  }, [tasks, localTick]);

  return (
    <Sheet>
      <Tooltip>
        <TooltipTrigger
          render={<SheetTrigger render={<div className="relative w-fit" />} />}
        >
          <Button variant="outline" size="icon">
            <BellRing />
          </Button>
          {visibleTasks.length > 0 && (
            <Badge className="absolute -top-1.5 -right-2 size-4 tabular-nums p-0 bg-red-300 text-red-700 dark:bg-red-700 dark:text-red-300">
              {visibleTasks.length > 9 ? '9+' : visibleTasks.length}
            </Badge>
          )}
        </TooltipTrigger>
        <TooltipContent>Task yang Akan Dimulai</TooltipContent>
      </Tooltip>
      <SheetContent
        className="flex flex-col"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Task yang Akan Dimulai</SheetTitle>
          <SheetDescription>
            Menampilkan task yang akan dimulai dalam 30 menit ke depan.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="max-h-[calc(100dvh-134px)]">
          <div className="px-4 space-y-3">
            {visibleTasks.map((task) => {
              const diffInMinutes =
                (new Date(task.scheduled_at) - new Date()) / 60000;
              const isUrgent = diffInMinutes <= 15;
              const picName = task.pic_name || '-';

              return (
                <div
                  key={task.id}
                  className={cn(
                    'p-3 space-y-2 text-sm rounded-lg border bg-card',
                    {
                      'bg-red-50 dark:bg-red-950/30': isUrgent,
                    },
                  )}
                >
                  <div className="flex justify-between items-start">
                    <p className="font-medium truncate">{task.content}</p>
                    <p className="text-sm">{picName}</p>
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
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default UpcomingTasksPanel;
