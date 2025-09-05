import { create } from 'zustand';

const usePics = create((set) => ({
  pics: [],
  isLoading: false,
  error: null,
  fetchData: async () => {
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
}));

export default usePics;
