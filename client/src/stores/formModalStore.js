import { create } from 'zustand';

const useFormModal = create((set) => ({
  isModalOpen: false,
  modalTitle: null,
  formId: null,
  isLoading: false,
  setIsModalOpen: (bool) => set({ isModalOpen: bool }),
  setModalTitle: (title) => set({ modalTitle: title }),
  setFormId: (id) => set({ formId: id }),
  setIsLoading: (bool) => set({ isLoading: bool }),
}));

export default useFormModal;
