import { useEffect, useState } from 'react';
import { formatTimestamp } from '@/utils/formatTimestamp';
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

const UpcomingTasksPanel = ({ tasks, currentTime }) => {
  const [visibleTasks, setVisibleTasks] = useState([]);

  useEffect(() => {
    if (!tasks || tasks.length === 0) {
      setVisibleTasks([]);
      return;
    }

    const upcoming = tasks
      .filter((task) => {
        if (task.status !== 'todo' || !task.scheduled_at) return false;

        const diffInMinutes =
          (new Date(task.scheduled_at) - currentTime) / 60000;

        return diffInMinutes > 0 && diffInMinutes <= 30;
      })
      .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));

    setVisibleTasks(upcoming);
  }, [tasks, currentTime]);

  return (
    <Sheet>
      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <div className="relative w-fit">
              <Button variant="outline" size="icon-sm">
                <BellRing />
              </Button>
              {visibleTasks.length > 0 && (
                <Badge className="absolute -top-2 -right-2 size-4 tabular-nums p-0 bg-red-300 text-red-700 dark:bg-red-700 dark:text-red-300">
                  {visibleTasks.length > 9 ? '9+' : visibleTasks.length}
                </Badge>
              )}
            </div>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent>Task yang Akan Dimulai</TooltipContent>
      </Tooltip>
      <SheetContent className="flex flex-col">
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
                (new Date(task.scheduled_at) - currentTime) / 60000;
              const isUrgent = diffInMinutes <= 15;

              return (
                <div
                  key={task.id}
                  className={cn('p-3 bg-card rounded-lg text-sm border', {
                    'bg-red-50 dark:bg-red-950/20': isUrgent,
                  })}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium truncate">{task.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimestamp(task.scheduled_at)}
                      </p>
                      <p
                        className={cn('text-xs font-semibold mt-1', {
                          'text-red-600 dark:text-red-400': isUrgent,
                          'text-blue-600 dark:text-blue-400': !isUrgent,
                        })}
                      >
                        {Math.ceil(diffInMinutes)} menit lagi
                      </p>
                    </div>
                    {isUrgent && (
                      <div className="shrink-0 size-2 rounded-full bg-red-500 mt-1 animate-pulse"></div>
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
