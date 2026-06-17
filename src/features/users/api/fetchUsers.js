import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export const fetchUsers = async () => {
  const response = await api.get('/profiles');
  return response.data;
};

export const fetchUsersQueryKey = () => ['profiles'];

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
