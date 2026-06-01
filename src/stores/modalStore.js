import { create } from 'zustand';

const useModalStore = create((set) => ({
  isUpdateOpen: false,
  isDeleteOpen: false,
  selectedTask: null,

  setUpdateOpen: (open, task = null) =>
    set({
      isUpdateOpen: open,
      selectedTask: open ? task : null,
    }),

  setDeleteOpen: (open, task = null) =>
    set({
      isDeleteOpen: open,
      selectedTask: open ? task : null,
    }),
}));

export default useModalStore;
