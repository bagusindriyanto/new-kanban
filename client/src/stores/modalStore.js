import { create } from 'zustand';

const useModal = create((set) => ({
  isModalOpen: false,
  modalTitle: null,
  formId: null,
  setIsModalOpen: (bool) => set({ isModalOpen: bool }),
  setModalTitle: (title) => set({ modalTitle: title }),
  setFormId: (id) => set({ formId: id }),
}));

export default useModal;
