import { create } from 'zustand';

type NotificationState = {
  notifiedTaskIds: Set<number>;
  markAsNotified: (taskId: number) => void;
};

const useNotificationStore = create<NotificationState>()((set) => ({
  notifiedTaskIds: new Set(),
  markAsNotified: (taskId) =>
    set((state) => ({
      notifiedTaskIds: new Set(state.notifiedTaskIds).add(taskId),
    })),
}));

export default useNotificationStore;
