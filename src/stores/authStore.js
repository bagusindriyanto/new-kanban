import { create } from 'zustand';
import { clearTokens, setTokens } from '@/lib/axios';

const useAuthStore = create((set) => ({
  currentUser: null, // { id, name, role, ... }
  isLoading: true, // untuk cek token saat pertama buka app

  setCurrentUser: (user) => set({ currentUser: user, isLoading: false }),

  /**
   * Login: store user data and JWT tokens.
   */
  login: (user, accessToken, refreshToken) => {
    setTokens(accessToken, refreshToken);
    set({ currentUser: user, isLoading: false });
  },

  /**
   * Clear user data and remove stored tokens.
   */
  clearCurrentUser: () => {
    clearTokens();
    set({ currentUser: null, isLoading: false });
  },
}));

export default useAuthStore;
