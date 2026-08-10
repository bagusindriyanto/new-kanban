import { queryOptions, useQuery } from '@tanstack/react-query';
import type { QueryConfig } from '@/lib/queryClient';
import { rolesQuery } from './query';
import { roleKeys } from './queryKeys';

export const fetchRoles = async () => {
  const { data, error } = await rolesQuery();
  if (error) throw error;
  return data;
};

const fetchRolesQueryOptions = () => {
  return queryOptions({
    queryKey: roleKeys.all,
    queryFn: fetchRoles,
  });
};

type UseFetchRolesParams = {
  queryConfig?: QueryConfig<typeof fetchRolesQueryOptions>;
};

export const useFetchRoles = ({ queryConfig }: UseFetchRolesParams = {}) => {
  return useQuery({
    ...fetchRolesQueryOptions(),
    ...queryConfig,
  });
};
