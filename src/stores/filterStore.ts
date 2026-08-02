import { create } from 'zustand';
import { startOfDay } from 'date-fns';

const initialState = {
  selectedUserId: 'all',
  range: { from: startOfDay(new Date()), to: startOfDay(new Date()) },
};

type FilterState = typeof initialState & {
  setSelectedUserId: (userId: string) => void;
  setRange: (newRange: { from: Date; to: Date }) => void;
  resetFilter: () => void;
};

const useFilterStore = create<FilterState>()((set) => ({
  ...initialState,

  setSelectedUserId: (userId) => set({ selectedUserId: userId }),
  setRange: (newRange) =>
    set({ range: { from: newRange?.from, to: newRange?.to } }),
  resetFilter: () => set(initialState),
}));

export default useFilterStore;
