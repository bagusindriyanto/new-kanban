import { useEffect, useRef, useState } from 'react';
import { formatToSQL } from '@/utils/formatTimestamp';
import type { TaskQueryResult } from '../api/fetchTasks';
import type { TaskUpdate } from '@/types/task';

export function usePauseTimer({
  task,
  updateTaskMutate,
}: {
  task: TaskQueryResult;
  updateTaskMutate: (task: TaskUpdate) => void;
}) {
  const { id, user_id, assigner_id, minute_pause, pause_time } = task;

  const isPaused = !!pause_time;

  const [currentPauseMinutes, setCurrentPauseMinutes] = useState(0);
  const pauseStartRef = useRef(null);

  useEffect(() => {
    if (!isPaused) {
      setCurrentPauseMinutes(0);
      pauseStartRef.current = null;
      return;
    }

    pauseStartRef.current = new Date(pause_time).getTime();

    const interval = setInterval(() => {
      const diffMs = Date.now() - pauseStartRef.current;
      setCurrentPauseMinutes(Math.floor(diffMs / 60000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, pause_time]);

  const totalPause = (minute_pause || 0) + (isPaused ? currentPauseMinutes : 0);

  const togglePause = () => {
    if (!task) return;

    if (isPaused) {
      // Play pressed: calculate total pause duration and reset pause_time
      const pauseDuration = Math.floor(
        (Date.now() - pauseStartRef.current) / 60000,
      );
      updateTaskMutate({
        id,
        user_id,
        assigner_id,
        minute_pause: (minute_pause || 0) + pauseDuration,
        pause_time: null,
      });
    } else {
      // Pause pressed: set pause_time to current time
      updateTaskMutate({
        id,
        user_id,
        assigner_id,
        pause_time: formatToSQL(new Date()),
      });
    }
  };

  return { isPaused, totalPause, togglePause };
}
