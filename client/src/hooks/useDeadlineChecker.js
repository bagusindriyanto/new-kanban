import { useEffect } from 'react';
import { toast } from 'sonner';
import useNotification from '@/stores/notificationStore';

const useDeadlineChecker = (tasks) => {
  const { notifiedTaskIds, markAsNotified, currentTime } = useNotification();

  useEffect(() => {
    const checkDeadlines = () => {
      tasks.forEach((task) => {
        if (!task.scheduled_at || task.status !== 'todo' || !!task.optimistic)
          return;

        const scheduledTime = new Date(task.scheduled_at);
        const diffInMinutes = Math.floor((scheduledTime - currentTime) / 60000);

        if (
          diffInMinutes > 0 &&
          diffInMinutes <= 15 &&
          !notifiedTaskIds.has(task.id)
        ) {
          toast.info(task.content, {
            description: `Task akan dimulai dalam ${diffInMinutes} menit.`,
            duration: 10000,
            closeButton: true,
          });

          markAsNotified(task.id);
        }
      });
    };

    const interval = setInterval(checkDeadlines, 60000);
    checkDeadlines();

    return () => clearInterval(interval);
  }, [tasks, notifiedTaskIds, markAsNotified, currentTime]);
};

export default useDeadlineChecker;
