import { useUrgencyCheck } from '@/features/tasks/hooks/useUrgencyCheck';
import type { UpcomingTask } from '../api/query';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const UpcomingTaskCard = ({ task }: { task: UpcomingTask }) => {
  const { isUrgent, diffInMinutes } = useUrgencyCheck({
    status: task.status,
    scheduled_at: task.scheduled_at,
  });

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <p className="text-2xl font-light leading-none tabular-nums tracking-tight">
          {task.scheduled_at ? format(task.scheduled_at, 'HH:mm') : '-'}
        </p>

        <div className="flex min-w-0 flex-col gap-0.5">
          <h3 className="truncate font-medium text-sm leading-none">
            {task.content}
          </h3>
          {task.detail && (
            <p className="text-xs text-muted-foreground">{task.detail}</p>
          )}
        </div>
      </div>
      <Badge
        className={cn('shrink-0 font-medium', {
          'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300': isUrgent,
          'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300':
            !isUrgent,
        })}
      >
        {Math.ceil(diffInMinutes)} menit lagi
      </Badge>
    </div>
  );
};

export default UpcomingTaskCard;
