import { queryOptions, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const fetchUsers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, avatar')
    .order('name');
  if (error) throw error;
  return data;
};

export const fetchUsersQueryKey = () => ['users'];

const fetchUsersQueryOptions = () => {
  return queryOptions({
    queryKey: fetchUsersQueryKey(),
    queryFn: fetchUsers,
  });
};

export const useFetchUsers = (params = {}) => {
  return useQuery({
    ...fetchUsersQueryOptions(),
    ...params.queryConfig,
  });
};
