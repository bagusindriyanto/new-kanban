import { useEffect, useRef, useState } from 'react';
import { formatToSQL } from '@/utils/formatTimestamp';
import type { TaskWithProfile } from '../api/query';
import type { TaskUpdate } from '@/types/task';

export const usePauseTimer = ({
  task,
  updateTaskMutate,
}: {
  task: TaskWithProfile;
  updateTaskMutate: (task: TaskUpdate) => void;
}) => {
  const { id, user_id, assigner_id, minute_pause, pause_time } = task;

  const isPaused = !!pause_time;

  const [currentPauseMinutes, setCurrentPauseMinutes] = useState(0);
  const pauseStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPaused) {
      pauseStartRef.current = null;
      return;
    }

    pauseStartRef.current = new Date(pause_time).getTime();

    // Initialize the minutes immediately so it doesn't wait 1 second for the first tick
    const diffMs = Date.now() - pauseStartRef.current;
    setCurrentPauseMinutes(Math.floor(diffMs / 60000));

    const interval = setInterval(() => {
      if (pauseStartRef.current === null) return;
      const diffMs = Date.now() - pauseStartRef.current;
      setCurrentPauseMinutes(Math.floor(diffMs / 60000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, pause_time]);

  const livePauseMinutes = isPaused ? currentPauseMinutes : 0;
  const totalPause = (minute_pause || 0) + livePauseMinutes;

  const togglePause = () => {
    if (!task) return;

    if (isPaused) {
      // Play pressed: calculate total pause duration and reset pause_time
      const pauseDuration = Math.floor(
        (Date.now() - (pauseStartRef.current ?? 0)) / 60000,
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
};
