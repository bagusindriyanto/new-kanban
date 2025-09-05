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

  fetchData: async () => {
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
}));

export default useTasks;
