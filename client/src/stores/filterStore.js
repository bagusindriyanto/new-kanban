import { create } from 'zustand';
import { startOfDay } from 'date-fns';

const useFilter = create((set) => ({
  selectedPicId: 'all',
  setSelectedPicId: (id) => set({ selectedPicId: id }),
  selectedTaskId: null,
  setSelectedTaskId: (taskId) => set({ selectedTaskId: taskId }),
  range: { from: startOfDay(new Date()), to: startOfDay(new Date()) },
  setRange: ({ from, to }) => set({ range: { from, to } }),
}));

export default useFilter;
