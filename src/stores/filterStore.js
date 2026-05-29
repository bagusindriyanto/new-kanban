import { create } from 'zustand';
import { startOfDay } from 'date-fns';

const useFilterStore = create((set) => ({
  selectedUserId: 'all',
  setSelectedUserId: (userId) => set({ selectedUserId: userId }),

  range: { from: startOfDay(new Date()), to: startOfDay(new Date()) },
  setRange: (newRange) =>
    set({ range: { from: newRange?.from, to: newRange?.to } }),
}));

export default useFilterStore;
