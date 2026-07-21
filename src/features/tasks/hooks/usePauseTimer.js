import { useEffect, useRef, useState } from 'react';
import { formatToSQL } from '@/utils/formatTimestamp';

/**
 * Custom hook to manage pause timer logic for a task card.
 *
 * Derives `isPaused` directly from `pause_time` prop (no redundant state).
 * Uses a single `setInterval` effect for the running pause duration.
 *
 * @param {Object} params
 * @param {Object} params.task - The full task object
 * @param {Function} params.updateTaskMutate - Mutation function to update the task
 * @returns {{ isPaused: boolean, totalPause: number, togglePause: () => void }}
 */
export function usePauseTimer({ task, updateTaskMutate }) {
  const { minute_pause, pause_time } = task;

  // Derive isPaused directly from props — no syncing needed
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
        ...task,
        minute_pause: (minute_pause || 0) + pauseDuration,
        pause_time: null,
      });
    } else {
      // Pause pressed: set pause_time to current time
      updateTaskMutate({
        ...task,
        pause_time: formatToSQL(new Date()),
      });
    }
  };

  return { isPaused, totalPause, togglePause };
}
