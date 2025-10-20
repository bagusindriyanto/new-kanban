import { create } from 'zustand';
import { api } from '@/lib/api';

const useTasks = create((set) => ({
  tasks: [],
  selectedTaskId: null,
  setSelectedTaskId: (taskId) => set({ selectedTaskId: taskId }),
  isLoading: false,

  moveTask: (oldId, newId) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === oldId ? { ...task, status: newId } : task
      ),
    })),

  updateTask: async (taskId, data) => {
    set({ isLoading: true });
    try {
      const now = new Date().toISOString();
      const res = await api.patch(`/tasks.php?id=${taskId}`, {
        ...data,
        updated_at: now,
      });
      if (res.status !== 201) throw new Error('Gagal memperbarui task');
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, ...res.data } : t
        ),
      }));
      return res.data;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useTasks;
