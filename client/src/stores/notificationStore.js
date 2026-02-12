import { create } from 'zustand';

const useNotification = create((set) => ({
  notifiedTaskIds: new Set(),
  markAsNotified: (taskId) =>
    set((state) => ({
      notifiedTaskIds: new Set(state.notifiedTaskIds).add(taskId),
    })),

  currentTime: new Date(),
  updateCurrentTime: () => set({ currentTime: new Date() }),
}));

export default useNotification;
