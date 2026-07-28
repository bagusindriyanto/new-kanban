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
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setInitialized(true);

      if (event === 'SIGNED_OUT') {
        setSelectedUserId('all');
        queryClient.clear();
      }
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        setSelectedUserId(session?.user?.id ?? 'all');
        queryClient.invalidateQueries();
      }
    });

    return () => subscription.unsubscribe();
  }, [setSession, setInitialized, setSelectedUserId]);
};
