import { queryOptions, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const fetchDashboard = async (filters = {}) => {
  const { data, error } = await supabase.rpc('get_dashboard_overview', {
    p_from_date: filters?.from_date ?? null,
    p_to_date: filters?.to_date ?? null,
  });
  if (error) throw error;
  return data;
};

export const fetchDashboardQueryKey = (filters = {}) => ['dashboard', filters];

const fetchDashboardQueryOptions = (filters = {}) => {
  return queryOptions({
    queryKey: fetchDashboardQueryKey(filters),
    queryFn: () => fetchDashboard(filters),
    placeholderData: (previousData) => previousData,
  });
};

export const useFetchDashboard = (filters = {}, params = {}) => {
  return useQuery({
    ...fetchDashboardQueryOptions(filters),
    ...params.queryConfig,
  });
};
