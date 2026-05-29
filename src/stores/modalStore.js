import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useModalStore = create()(
  devtools((set) => ({
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
  })),
);

export default useModalStore;
