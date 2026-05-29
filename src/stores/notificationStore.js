import { create } from 'zustand';

const useNotificationStore = create((set) => ({
  notifiedTaskIds: new Set(),
  markAsNotified: (taskId) =>
    set((state) => ({
      notifiedTaskIds: new Set(state.notifiedTaskIds).add(taskId),
    })),
}));

export default useNotificationStore;
