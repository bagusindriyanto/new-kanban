import { create } from 'zustand';

const usePics = create((set) => ({
  pics: [],
  isLoading: false,
  error: null,
  fetchPics: async () => {
    // Set isLoading to true while fetching data
    set({ isLoading: true });

    try {
      const res = await fetch('http://localhost/kanban/api/pics.php');
      const data = await res.json();
      set({ pics: data });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addPic: async (name) => {
    set({ isLoading: true });
    try {
      const res = await fetch('http://localhost/kanban/api/pics.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error('Failed to add PIC');
      const newPic = await res.json();
      set((state) => ({ pics: [newPic, ...state.pics] }));
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default usePics;
