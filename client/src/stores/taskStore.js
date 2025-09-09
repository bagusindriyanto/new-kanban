import { create } from 'zustand';
import axios from 'axios';

const useTasks = create((set) => ({
  tasks: [],
  selectedTaskId: null,
  setSelectedTaskId: (taskId) => set({ selectedTaskId: taskId }),
  isLoading: false,
  error: null,

  moveTask: (oldId, newId) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === oldId ? { ...task, status: newId } : task
      ),
    })),

  fetchTasks: async () => {
    // Set isLoading to true while fetching data
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get('http://localhost/kanban/api/tasks.php');
      set({ tasks: res.data });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addTask: async ({ content, pic_id, detail }) => {
    set({ isLoading: true, error: null });
    try {
      const now = new Date().toISOString();
      const res = await axios.post('http://localhost/kanban/api/tasks.php', {
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
      if (res.status === 201) {
        set((state) => ({ tasks: [res.data, ...state.tasks] }));
      }
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateTask: async (taskId, data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.patch(
        `http://localhost/kanban/api/tasks.php?id=${taskId}`,
        data
      );
      if (res.status === 201) {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, ...res.data } : t
          ),
        }));
      }
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTask: async (taskId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.delete(
        `http://localhost/kanban/api/tasks.php?id=${taskId}`
      );
      if (res.status === 200) {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== res.data.id),
        }));
      }
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useTasks;
