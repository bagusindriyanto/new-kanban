import { queryOptions, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import useAuthStore from '@/stores/authStore';

export const fetchProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select(
      `
      id,
      name,
      full_name,
      avatar,
      nik,
      role:roles (name)
      `,
    )
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
};

export const fetchProfileQueryKey = (userId) => ['profile', userId];

const fetchProfileQueryOptions = (userId) => {
  return queryOptions({
    queryKey: fetchProfileQueryKey(userId),
    queryFn: () => fetchProfile(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useFetchProfile = (params = {}) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const userId = currentUser?.id;

  return useQuery({
    ...fetchProfileQueryOptions(userId),
    ...params.queryConfig,
  });
};
