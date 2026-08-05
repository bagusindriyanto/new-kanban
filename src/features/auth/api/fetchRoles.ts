import { queryOptions, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { QueryConfig } from '@/lib/queryClient';

export const fetchRoles = async () => {
  const { data, error } = await supabase.from('roles').select('id, name');
  if (error) throw error;
  return data;
};

export const fetchRolesQueryKey = () => ['roles'];

const fetchRolesQueryOptions = () => {
  return queryOptions({
    queryKey: fetchRolesQueryKey(),
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
