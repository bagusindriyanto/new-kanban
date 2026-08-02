import type { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

type AuthState = {
  session: Session | null;
  currentUser: User | null;
  isInitialized: boolean;

  setSession: (session: Session | null) => void;
  setInitialized: (value: boolean) => void;
};

const useAuthStore = create<AuthState>()((set) => ({
  session: null,
  currentUser: null,
  isInitialized: false,

  setSession: (session) => set({ session, currentUser: session?.user ?? null }),
  setInitialized: (value) => set({ isInitialized: value }),
}));

export default useAuthStore;
