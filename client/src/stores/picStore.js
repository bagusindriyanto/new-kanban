import { create } from 'zustand';
import axios from 'axios';

const usePics = create((set) => ({
  pics: [],
  isLoading: false,

  fetchPics: async () => {
    // Set isLoading to true while fetching data
    set({ isLoading: true });
    try {
      const res = await axios.get(
        'http://192.168.1.14:8080/kanban/api/pics.php'
      );
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
      const res = await axios.post(
        'http://192.168.1.14:8080/kanban/api/pics.php',
        {
          name,
        }
      );
      if (res.status !== 201) throw new Error('Gagal menambahkan PIC');
      set((state) => ({ pics: [res.data, ...state.pics] }));
      return res.data;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default usePics;
