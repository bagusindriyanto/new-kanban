import { create } from 'zustand';

const useFilter = create((set) => ({
  picId: 'all',
  setPicId: (id) => set({ picId: id }),
}));

export default useFilter;
