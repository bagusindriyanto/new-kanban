import { useEffect } from 'react';
import { toast } from 'sonner';
import useNotification from '@/stores/notificationStore';

const EMPTY_TASKS = [];

const useDeadlineChecker = (tasks = EMPTY_TASKS) => {
  const { notifiedTaskIds, markAsNotified } = useNotification();

  useEffect(() => {
    const checkDeadlines = () => {
      if (!Array.isArray(tasks) || tasks.length === 0) return;

      const now = new Date();
      tasks.forEach((task) => {
        if (!task.scheduled_at) return;

        const scheduledTime = new Date(task.scheduled_at);
        const diffInMinutes = Math.ceil((scheduledTime - now) / 60000);

        if (diffInMinutes > 0 && diffInMinutes <= 15) {
          const notifyId = `${task.id}-15`;
          if (!notifiedTaskIds.has(notifyId)) {
            toast.info(task.content, {
              position: 'bottom-center',
              description: `Task "${task.content}" harus segera dimulai dalam ${diffInMinutes} menit.`,
              duration: 10000,
              closeButton: true,
            });
            markAsNotified(notifyId);
          }
        }
      });
    };

    const interval = setInterval(checkDeadlines, 1000);
    checkDeadlines();

    return () => clearInterval(interval);
  }, [tasks, notifiedTaskIds, markAsNotified]);
};

export default useDeadlineChecker;
