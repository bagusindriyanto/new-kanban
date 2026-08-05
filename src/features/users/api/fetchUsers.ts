import { queryOptions, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { QueryData } from '@supabase/supabase-js';
import type { QueryConfig } from '@/lib/queryClient';

const buildFetchUsersQuery = () =>
  supabase
    .from('profiles')
    .select('user_id, name, full_name, avatar')
    .order('name');

export type UsersQueryResult = QueryData<
  ReturnType<typeof buildFetchUsersQuery>
>;

export const fetchUsers = async () => {
  const { data, error } = await buildFetchUsersQuery();
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

type UseFetchUsersParams = {
  queryConfig?: QueryConfig<typeof fetchUsersQueryOptions>;
};

export const useFetchUsers = ({ queryConfig }: UseFetchUsersParams = {}) => {
  return useQuery({
    ...fetchUsersQueryOptions(),
    ...queryConfig,
  });
};
