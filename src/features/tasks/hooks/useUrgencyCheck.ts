import type { TaskStatus } from '@/types/task';
import { useEffect, useState } from 'react';

export function useUrgencyCheck({
  status,
  scheduled_at,
  optimistic = false,
}: {
  status: TaskStatus;
  scheduled_at: string | null | undefined;
  optimistic?: boolean;
}) {
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    if (status !== 'todo' || !scheduled_at) return;

    const checkUrgency = () => {
      const diffInMinutes =
        (new Date(scheduled_at).getTime() - new Date().getTime()) / 60000;
      setIsUrgent(diffInMinutes > 0 && diffInMinutes <= 15 && !optimistic);
    };

    checkUrgency();
    const urgentTimer = setInterval(checkUrgency, 1000);
    return () => clearInterval(urgentTimer);
  }, [status, scheduled_at, optimistic]);

  const diffInMinutes = scheduled_at
    ? (new Date(scheduled_at).getTime() - new Date().getTime()) / 60000
    : 0;

  return { isUrgent, diffInMinutes };
}
