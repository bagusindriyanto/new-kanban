import { create } from 'zustand';

const useDeleteTaskModal = create((set) => ({
  isModalOpen: false,
  setIsModalOpen: (bool) => set({ isModalOpen: bool }),
}));

export default useDeleteTaskModal;
