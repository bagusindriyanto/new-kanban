import { Button } from '@/components/ui/button';
import { PauseIcon, PlayIcon } from '@heroicons/react/24/solid';
import {
  TimerIcon,
  CirclePauseIcon,
  SquarePenIcon,
  Trash2Icon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDuration } from '@/utils/formatDuration';

/**
 * Renders the footer section of a TaskCard,
 * including pause info display and action buttons.
 */
const TaskActions = ({
  status,
  optimistic,
  isPaused,
  totalPause,
  minute_activity,
  togglePause,
  onEdit,
  onDelete,
  canModify,
}) => {
  return (
    <div className="flex gap-2 justify-between items-center mt-1">
      {/* Pause / Activity Info */}
      <div className="flex items-center">
        {status === 'on progress' && (totalPause > 0 || isPaused) && (
          <div
            className={cn(
              'flex gap-1 items-center tabular-nums text-[11px] text-destructive',
              isPaused && 'animate-pulse',
            )}
          >
            <CirclePauseIcon className="size-4" />
            <span>{formatDuration(totalPause)}</span>
          </div>
        )}

        {status === 'done' && (
          <div className="flex items-center gap-2 text-[11px]">
            <span className="flex gap-1 items-center font-medium tabular-nums">
              <TimerIcon className="size-4.5" />{' '}
              {formatDuration(minute_activity || 0)}
            </span>
            {totalPause > 0 && (
              <span className="flex gap-1 items-center tabular-nums opacity-70 text-muted-foreground">
                <CirclePauseIcon className="size-4" />{' '}
                {formatDuration(totalPause)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {canModify && (
        <div className="flex gap-1 items-center">
          {status === 'on progress' && (
            <Button
              onClick={togglePause}
              variant={isPaused ? 'destructive' : 'outline'}
              size="icon-xs"
              disabled={optimistic}
            >
              {isPaused ? <PlayIcon /> : <PauseIcon />}
            </Button>
          )}

          <Button
            onClick={onEdit}
            variant="outline"
            size="icon-xs"
            disabled={optimistic}
          >
            <SquarePenIcon />
          </Button>

          <Button
            onClick={onDelete}
            variant="outline"
            size="icon-xs"
            disabled={optimistic}
          >
            <Trash2Icon />
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskActions;
