import { create } from 'zustand';
import { api } from '@/api/api';

const usePics = create((set) => ({
  pics: [],
  isLoading: false,

  fetchPics: async () => {
    // Set isLoading to true while fetching data
    set({ isLoading: true });
    try {
      const res = await api.get('/pics.php');
      if (res.status !== 200) throw new Error('Gagal mengambil data PIC');
      set({ pics: res.data });
      return res.data;
    } finally {
      set({ isLoading: false });
    }
  },

  addPic: async (name) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/pics.php', { name });
      if (res.status !== 201) throw new Error('Gagal menambahkan PIC');
      set((state) => ({ pics: [res.data, ...state.pics] }));
      return res.data;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default usePics;
