import { parseFromSQL } from '@/utils/formatTimestamp';
import { cn } from '@/lib/utils';

/**
 * Renders the status-context row of a TaskCard,
 * showing relevant timestamps based on the current task status.
 */
const TaskTimestamps = ({
  status,
  timestamp_todo,
  timestamp_progress,
  timestamp_pending,
  timestamp_done,
  pause_time,
  scheduled_at,
  isPaused,
  isUrgent,
  diffInMinutes,
}) => {
  return (
    <div className="text-[11px] text-muted-foreground border-t border-border pt-1">
      {status === 'todo' && (
        <div className="flex gap-1 justify-between">
          <p className="font-medium">Dibuat:</p>
          <p className="tabular-nums">{parseFromSQL(timestamp_todo)}</p>
        </div>
      )}

      {status === 'todo' && scheduled_at && (
        <div className="relative mt-1">
          {isUrgent && (
            <span className="absolute -right-1.5 -top-0.5 z-10 flex size-2">
              <span className="inline-flex absolute w-full h-full bg-red-400 rounded-full opacity-75 animate-ping"></span>
              <span className="inline-flex relative bg-red-500 rounded-full size-2"></span>
            </span>
          )}
          <div
            className={cn(
              'flex gap-1 justify-between rounded-md px-1 -mx-1 py-0.5 font-medium border transition-colors',
              {
                'border-red-200 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400':
                  isUrgent,
                'border-muted bg-muted/50 text-muted-foreground opacity-60':
                  diffInMinutes <= 0 && !isUrgent,
                'border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400':
                  diffInMinutes > 15,
              },
            )}
          >
            <p className="font-medium">Terjadwal:</p>
            <p className="tabular-nums">{parseFromSQL(scheduled_at)}</p>
          </div>
        </div>
      )}

      {status !== 'todo' && (
        <div className="flex gap-1 justify-between">
          <p className="font-medium">Mulai:</p>
          <p className="tabular-nums">{parseFromSQL(timestamp_progress)}</p>
        </div>
      )}

      {status === 'on progress' && isPaused && (
        <div className="flex gap-1 justify-between">
          <p className="font-medium">Jeda:</p>
          <p className="tabular-nums">{parseFromSQL(pause_time)}</p>
        </div>
      )}

      {status === 'pending' && (
        <div className="flex gap-1 justify-between">
          <p className="font-medium">Pending:</p>
          <p className="tabular-nums">{parseFromSQL(timestamp_pending)}</p>
        </div>
      )}

      {status === 'done' && (
        <div className="flex gap-1 justify-between">
          <p className="font-medium">Selesai:</p>
          <p className="tabular-nums">{parseFromSQL(timestamp_done)}</p>
        </div>
      )}
    </div>
  );
};

export default TaskTimestamps;
