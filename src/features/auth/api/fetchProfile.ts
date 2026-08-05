import { queryOptions, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import useAuthStore from '@/stores/authStore';
import type { QueryConfig } from '@/lib/queryClient';

export const fetchProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select(
      `
      user_id,
      name,
      full_name,
      avatar,
      nik,
      role:roles (name)
      `,
    )
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  return data;
};

export const fetchProfileQueryKey = (userId: string) => ['profile', userId];

const fetchProfileQueryOptions = (userId: string) => {
  return queryOptions({
    queryKey: fetchProfileQueryKey(userId),
    queryFn: () => fetchProfile(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

type UseFetchProfileParams = {
  queryConfig?: QueryConfig<typeof fetchProfileQueryOptions>;
};

export const useFetchProfile = ({
  queryConfig,
}: UseFetchProfileParams = {}) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const userId = currentUser?.id;

  return useQuery({
    ...fetchProfileQueryOptions(userId),
    ...queryConfig,
  });
};
