import { create } from 'zustand';

const useModal = create((set) => ({
  isModalOpen: false,
  setIsModalOpen: (bool) => set({ isModalOpen: bool }),
}));

export default useModal;
