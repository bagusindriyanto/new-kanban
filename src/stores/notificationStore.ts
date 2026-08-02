import { create } from 'zustand';

type NotificationState = {
  notifiedTaskIds: Set<string>;
  markAsNotified: (notifyId: string) => void;
};

const useNotificationStore = create<NotificationState>()((set) => ({
  notifiedTaskIds: new Set(),
  markAsNotified: (notifyId) =>
    set((state) => ({
      notifiedTaskIds: new Set(state.notifiedTaskIds).add(notifyId),
    })),
}));

export default useNotificationStore;
