import { create } from 'zustand';

const useConfirmModal = create((set) => ({
  isModalOpen: false,
  setIsModalOpen: (bool) => set({ isModalOpen: bool }),
}));

export default useConfirmModal;
