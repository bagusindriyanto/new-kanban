import { queryOptions, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

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

export const useFetchRoles = (params = {}) => {
  return useQuery({
    ...fetchRolesQueryOptions(),
    ...params.queryConfig,
  });
};
