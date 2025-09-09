import { create } from 'zustand';
import axios from 'axios';

const useActivities = create((set) => ({
  activities: [],
  isLoading: false,
  error: null,

  fetchActivities: async () => {
    // Set isLoading to true while fetching data
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get('http://localhost/kanban/api/activities.php');
      set({ activities: res.data });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addActivity: async (name) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(
        'http://localhost/kanban/api/activities.php',
        { name }
      );
      if (res.status === 201) {
        set((state) => ({ activities: [res.data, ...state.activities] }));
      }
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useActivities;
