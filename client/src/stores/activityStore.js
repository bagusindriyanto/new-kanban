import { create } from 'zustand';
import axios from 'axios';

const useActivities = create((set) => ({
  activities: [],
  isLoading: false,

  fetchActivities: async () => {
    // Set isLoading to true while fetching data
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get('http://localhost/kanban/api/activities.php');
      if (res.status !== 200) throw new Error('Gagal mengambil data activity');
      set({ activities: res.data });
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
      if (res.status !== 201) throw new Error('Gagal menambahkan activity');
      set((state) => ({ activities: [res.data, ...state.activities] }));
      return res.data;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useActivities;
