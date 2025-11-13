import { create } from 'zustand';

const useUpdateTaskModal = create((set) => ({
  isModalOpen: false,
  setIsModalOpen: (bool) => set({ isModalOpen: bool }),
}));

export default useUpdateTaskModal;
