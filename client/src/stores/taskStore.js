import { create } from 'zustand';
import { api } from '@/api/api';

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

  fetchTasks: async () => {
    // Set isLoading to true while fetching data
    set({ isLoading: true });
    try {
      const res = await api.get('/tasks.php');
      if (res.status !== 200) throw new Error('Gagal mengambil data task');
      set({ tasks: res.data });
      return res.data;
    } finally {
      set({ isLoading: false });
    }
  },

  addTask: async ({ content, pic_id, detail }) => {
    set({ isLoading: true });
    try {
      const now = new Date().toISOString();
      const res = await api.post('/tasks.php', {
        content,
        pic_id,
        detail,
        status: 'todo',
        timestamp_todo: now,
        timestamp_progress: null,
        timestamp_done: null,
        timestamp_archived: null,
        minute_pause: 0,
        minute_activity: 0,
        pause_time: null,
      });
      if (res.status !== 201) throw new Error('Gagal menambahkan task');
      set((state) => ({ tasks: [res.data, ...state.tasks] }));
      return res.data;
    } finally {
      set({ isLoading: false });
    }
  },

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

  deleteTask: async (taskId) => {
    set({ isLoading: true });
    try {
      const res = await api.delete(`/tasks.php?id=${taskId}`);
      if (res.status !== 200) throw new Error('Gagal menghapus task');
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== res.data.id),
      }));
      return res.data;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useTasks;
