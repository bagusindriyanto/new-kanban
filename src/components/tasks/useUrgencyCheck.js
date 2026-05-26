import { useEffect, useState } from 'react';

/**
 * Custom hook to determine if a "todo" task is urgent
 * (scheduled within the next 15 minutes).
 *
 * @param {Object} params
 * @param {string} params.status - The task status
 * @param {string|null} params.scheduled_at - The scheduled timestamp
 * @param {boolean} params.optimistic - Whether the task is optimistically rendered
 * @returns {{ isUrgent: boolean, diffInMinutes: number }}
 */
export function useUrgencyCheck({ status, scheduled_at, optimistic = false }) {
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    if (status !== 'todo' || !scheduled_at) return;

    const checkUrgency = () => {
      const diffInMinutes = (new Date(scheduled_at) - new Date()) / 60000;
      setIsUrgent(diffInMinutes > 0 && diffInMinutes <= 15 && !optimistic);
    };

    checkUrgency();
    const urgentTimer = setInterval(checkUrgency, 1000);
    return () => clearInterval(urgentTimer);
  }, [status, scheduled_at, optimistic]);

  const diffInMinutes = scheduled_at
    ? (new Date(scheduled_at) - new Date()) / 60000
    : 0;

  return { isUrgent, diffInMinutes };
}
