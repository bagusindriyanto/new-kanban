import { queryClient } from '@/lib/queryClient';
import { supabase } from '@/lib/supabase';
import useAuthStore from '@/stores/authStore';
import useFilterStore from '@/stores/filterStore';
import { useEffect, useRef } from 'react';

export const useAuthListener = () => {
  const setSession = useAuthStore((state) => state.setSession);
  const setInitialized = useAuthStore((state) => state.setInitialized);
  const setSelectedUserId = useFilterStore((state) => state.setSelectedUserId);
  const resetFilter = useFilterStore((state) => state.resetFilter);
  const currentUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setInitialized(true);

      const userId = session?.user?.id ?? null;

      if (event === 'SIGNED_OUT') {
        currentUserIdRef.current = null;
        resetFilter();
        queryClient.clear();
      }
      if (event === 'INITIAL_SESSION') {
        setSelectedUserId(userId ?? 'all');
        // Only invalidate if we haven't loaded data for this user yet
        if (userId && userId !== currentUserIdRef.current) {
          currentUserIdRef.current = userId;
          queryClient.invalidateQueries();
        }
      }
      if (event === 'SIGNED_IN') {
        setSelectedUserId(userId ?? 'all');
        // Only invalidate if user actually changed (not just a token refresh)
        if (userId !== currentUserIdRef.current) {
          currentUserIdRef.current = userId;
          queryClient.invalidateQueries();
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [setSession, setInitialized, setSelectedUserId, resetFilter]);
};
