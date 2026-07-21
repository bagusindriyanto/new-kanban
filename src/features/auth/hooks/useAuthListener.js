import { queryClient } from '@/lib/queryClient';
import { supabase } from '@/lib/supabase';
import useAuthStore from '@/stores/authStore';
import useFilterStore from '@/stores/filterStore';
import { useEffect } from 'react';

export const useAuthListener = () => {
  const setSession = useAuthStore((state) => state.setSession);
  const setInitialized = useAuthStore((state) => state.setInitialized);
  const setSelectedUserId = useFilterStore((state) => state.setSelectedUserId);

  useEffect(() => {
    // subscribe perubahan (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setInitialized(true);
      setSelectedUserId(session?.user?.id ?? 'all');

      if (event === 'SIGNED_OUT') {
        queryClient.clear(); // bersihkan semua cache user-specific
      }
      if (event === 'SIGNED_IN') {
        queryClient.invalidateQueries(); // refetch data yang bergantung ke user
      }
    });

    return () => subscription.unsubscribe();
  }, [setSession, setInitialized]);
};
