import { create } from 'zustand';

const useActivities = create((set) => ({
  activities: [],
  isLoading: false,
  error: null,
  fetchData: async () => {
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
}));

export default useActivities;
