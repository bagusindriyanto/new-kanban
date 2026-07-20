import { create } from 'zustand';

const useAuthStore = create((set) => ({
  session: null,
  currentUser: null,
  isInitialized: false,

  setSession: (session) => set({ session, currentUser: session?.user ?? null }),
  setInitialized: (value) => set({ isInitialized: value }),
}));

export default useAuthStore;
