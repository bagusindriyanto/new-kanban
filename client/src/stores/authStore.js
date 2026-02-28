import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null, // { id, name, role }
  isLoading: true, // untuk cek session saat pertama buka app

  setUser: (user) => set({ user, isLoading: false }),
  clearUser: () => set({ user: null, isLoading: false }),
}));

export default useAuthStore;
