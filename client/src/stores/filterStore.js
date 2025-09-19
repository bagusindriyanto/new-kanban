import { create } from 'zustand';

const useFilter = create((set) => ({
  selectedPicId: 'all',
  setSelectedPicId: (id) => set({ selectedPicId: id }),
  range: { from: new Date(), to: new Date() },
  setRange: ({ from, to }) => set({ range: { from, to } }),
}));

export default useFilter;
