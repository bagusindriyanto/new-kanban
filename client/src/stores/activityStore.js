import { create } from 'zustand';

const useActivities = create((set) => ({
  activities: [],
  isLoading: false,
  error: null,
  fetchActivities: async () => {
    // Set isLoading to true while fetching data
    set({ isLoading: true });

    try {
      const res = await fetch('http://localhost/kanban/api/activities.php');
      const data = await res.json();
      set({ activities: data });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  addActivity: async (name) => {
    set({ isLoading: true });
    try {
      const res = await fetch('http://localhost/kanban/api/activities.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error('Failed to add activity');
      const newActivity = await res.json();
      set((state) => ({ activities: [newActivity, ...state.activities] }));
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useActivities;
