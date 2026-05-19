import { create } from 'zustand';
import { startOfDay } from 'date-fns';

const useFilter = create((set) => ({
  selectedPicId: 'all',
  setSelectedPicId: (id) => set({ selectedPicId: id }),

  selectedTaskId: null,
  setSelectedTaskId: (taskId) => set({ selectedTaskId: taskId }),

  range: { from: startOfDay(new Date()), to: startOfDay(new Date()) },
  setRange: (newRange) =>
    set({ range: { from: newRange?.from, to: newRange?.to } }),
}));

export default useFilter;
