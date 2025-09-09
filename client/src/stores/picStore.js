import { create } from 'zustand';
import axios from 'axios';

const usePics = create((set) => ({
  pics: [],
  isLoading: false,
  error: null,

  fetchPics: async () => {
    // Set isLoading to true while fetching data
    set({ isLoading: true, error: null });

    try {
      const res = await axios.get('http://localhost/kanban/api/pics.php');
      set({ pics: res.data });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addPic: async (name) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post('http://localhost/kanban/api/pics.php', {
        name,
      });
      if (res.status === 201) {
        set((state) => ({ pics: [res.data, ...state.pics] }));
      }
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default usePics;
