import { create } from 'zustand';
import { clearTokens, setTokens } from '@/lib/api';

const useAuthStore = create((set) => ({
  user: null, // { id, name, role, ... }
  isLoading: true, // untuk cek token saat pertama buka app

  setUser: (user) => set({ user, isLoading: false }),

  /**
   * Login: store user data and JWT tokens.
   */
  login: (user, accessToken, refreshToken) => {
    setTokens(accessToken, refreshToken);
    set({ user, isLoading: false });
  },

  /**
   * Clear user data and remove stored tokens.
   */
  clearUser: () => {
    clearTokens();
    set({ user: null, isLoading: false });
  },
}));

export default useAuthStore;
