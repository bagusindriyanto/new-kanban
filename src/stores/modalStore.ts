import type { Task } from '@/types/task';
import { create } from 'zustand';

type ModalState = {
  isUpdateOpen: boolean;
  isDeleteOpen: boolean;
  selectedTask: Task | null;

  setUpdateOpen: (open: boolean, task: Task | null) => void;
  setDeleteOpen: (open: boolean, task: Task | null) => void;
};

const useModalStore = create<ModalState>()((set) => ({
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
