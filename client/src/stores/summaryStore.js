import { create } from 'zustand';
import { api } from '@/lib/api';

const useSummary = create((set) => ({
  summary: [],
  tableSummary: [],
  isLoading: false,

  fetchSummary: async () => {
    // Set isLoading to true while fetching data
    set({ isLoading: true });
    try {
      const res = await api.get('/summary.php');
      if (res.status !== 200) throw new Error('Gagal mengambil data Summary');
      set({ summary: res.data });
      return res.data;
    } finally {
      set({ isLoading: false });
    }
  },
  fetchTableSummary: async () => {
    // Set isLoading to true while fetching data
    set({ isLoading: true });
    try {
      const res = await api.get('/table_summary.php');
      if (res.status !== 200)
        throw new Error('Gagal mengambil data Table Summary');
      set({ tableSummary: res.data });
      return res.data;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useSummary;
