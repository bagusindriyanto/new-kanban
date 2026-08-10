import { queryOptions, useQuery } from '@tanstack/react-query';
import type { QueryConfig } from '@/lib/queryClient';
import { userQuery } from './query';
import { userKeys } from './queryKeys';

export const fetchUsers = async () => {
  const { data, error } = await userQuery();
  if (error) throw error;
  return data;
};

const fetchUsersQueryOptions = () => {
  return queryOptions({
    queryKey: userKeys.all,
    queryFn: fetchUsers,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
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
