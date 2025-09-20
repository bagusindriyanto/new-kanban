import { create } from 'zustand';
import axios from 'axios';

const useSummary = create((set) => ({
  summary: [],
  tableSummary: [],
  isLoading: false,

  fetchSummary: async () => {
    // Set isLoading to true while fetching data
    set({ isLoading: true });
    try {
      const res = await axios.get(
        'http://192.168.1.14:8080/kanban/api/summary.php'
      );
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
      const res = await axios.get(
        'http://192.168.1.14:8080/kanban/api/table_summary.php'
      );
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
