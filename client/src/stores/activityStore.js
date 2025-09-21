import { create } from 'zustand';
import { api } from '@/api/api';

const useActivities = create((set) => ({
  activities: [],
  isLoading: false,

  fetchActivities: async () => {
    // Set isLoading to true while fetching data
    set({ isLoading: true });
    try {
      const res = await api.get('/activities.php');
      if (res.status !== 200) throw new Error('Gagal mengambil data activity');
      set({ activities: res.data });
    } finally {
      set({ isLoading: false });
    }
  },

  addActivity: async (name) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/activities.php', { name });
      if (res.status !== 201) throw new Error('Gagal menambahkan activity');
      set((state) => ({ activities: [res.data, ...state.activities] }));
      return res.data;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useActivities;
