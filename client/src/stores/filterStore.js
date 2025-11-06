import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { startOfDay } from 'date-fns';

const useFilter = create()(
  persist(
    (set) => ({
      selectedPicId: 'all',
      setSelectedPicId: (id) => set({ selectedPicId: id }),
      selectedTaskId: null,
      setSelectedTaskId: (taskId) => set({ selectedTaskId: taskId }),
      range: { from: startOfDay(new Date()), to: startOfDay(new Date()) },
      setRange: ({ from, to }) => set({ range: { from, to } }),
    }),
    {
      name: 'filters',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ selectedPicId: state.selectedPicId }),
    }
  )
);

export default useFilter;
