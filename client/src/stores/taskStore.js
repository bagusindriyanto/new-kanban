import { create } from 'zustand';

const useTasks = create((set) => ({
  tasks: [],
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
    set({ isLoading: true });
    try {
      const res = await fetch('http://localhost/kanban/api/tasks.php');
      const data = await res.json();
      set({ tasks: data });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addTask: async ({ content, pic_id, detail }) => {
    set({ isLoading: true });
    try {
      const now = new Date().toISOString();
      const res = await fetch('http://localhost/kanban/api/tasks.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        }),
      });
      if (!res.ok) throw new Error('Failed to add task');
      const newTask = await res.json();
      set((state) => ({ tasks: [newTask, ...state.tasks] }));
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useTasks;
