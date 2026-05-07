import { useEffect } from 'react';
import { toast } from 'sonner';
import useNotification from '@/stores/notificationStore';

const useDeadlineChecker = (tasks = []) => {
  const { notifiedTaskIds, markAsNotified } = useNotification();

  useEffect(() => {
    const checkDeadlines = () => {
      const now = new Date();
      tasks.forEach((task) => {
        if (!task.scheduled_at) return;

        const scheduledTime = new Date(task.scheduled_at);
        const diffInMinutes = Math.ceil((scheduledTime - now) / 60000);

        if (diffInMinutes > 15 && diffInMinutes <= 30) {
          const notifyId = `${task.id}-30`;
          if (!notifiedTaskIds.has(notifyId)) {
            toast.info(task.content, {
              position: 'bottom-center',
              description: `Task akan dimulai dalam ${diffInMinutes} menit.`,
              duration: 10000,
              closeButton: true,
            });
            markAsNotified(notifyId);
          }
        } else if (diffInMinutes > 0 && diffInMinutes <= 15) {
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

    const interval = setInterval(checkDeadlines, 15000);
    checkDeadlines();

    return () => clearInterval(interval);
  }, [tasks, notifiedTaskIds, markAsNotified]);
};

export default useDeadlineChecker;
