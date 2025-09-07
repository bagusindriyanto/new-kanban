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
    set({ isLoading: true, error: null });
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
    set({ isLoading: true, error: null });
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

  updateTask: async (taskId, data) => {
    const {
      content,
      pic_id,
      detail,
      status,
      timestamp_todo,
      // timestamp_progress,
      // timestamp_done,
      // timestamp_archived,
      minute_pause,
      // minute_activity,
      // pause_time,
    } = data;
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(
        `http://localhost/kanban/api/tasks.php?id=${taskId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content,
            pic_id,
            detail,
            status,
            timestamp_todo,
            // timestamp_progress,
            // timestamp_done,
            // timestamp_archived,
            // minute_pause,
            // minute_activity,
            // pause_time,
          }),
        }
      );
      if (!res.ok) throw new Error('Failed to update task');
      const updatedTask = await res.json();
      set((prev) => ({
        tasks: prev.tasks.map((t) =>
          t.id === taskId
            ? {
                content,
                pic_id,
                detail,
                status,
                timestamp_todo,
                // timestamp_progress,
                // timestamp_done,
                // timestamp_archived,
                // minute_pause,
                // minute_activity,
                // pause_time,
                ...t,
              }
            : t
        ),
      }));
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useTasks;
