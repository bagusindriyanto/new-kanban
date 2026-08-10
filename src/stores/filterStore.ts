import { create } from 'zustand';
import { startOfDay } from 'date-fns';
import type { Profile } from '@/types/profile';

export const ALL_USER = 'all' as const;

export type SelectedUserId = Profile['user_id'] | typeof ALL_USER;

const initialState = {
  selectedUserId: ALL_USER,
  range: { from: startOfDay(new Date()), to: undefined },
};

type FilterState = {
  selectedUserId: SelectedUserId;
  range: { from: Date | undefined; to?: Date | undefined };

  setSelectedUserId: (userId: SelectedUserId) => void;
  setRange: (newRange: {
    from: Date | undefined;
    to?: Date | undefined;
  }) => void;
  resetFilter: () => void;
};

export const useFilterStore = create<FilterState>()((set) => ({
  ...initialState,

  setSelectedUserId: (userId) => set({ selectedUserId: userId }),
  setRange: (newRange) =>
    set({ range: { from: newRange.from, to: newRange?.to } }),
  resetFilter: () => set(initialState),
}));
