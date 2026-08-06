import { queryOptions, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { QueryParams } from '../hooks/useDashboardFilters';
import type { QueryConfig } from '@/lib/queryClient';
import { dashboardSchema } from '../schemas/dashboardSchema';

export const fetchDashboard = async (filters: QueryParams = {}) => {
  const { data, error } = await supabase.rpc('get_dashboard_overview', {
    p_from_date: filters?.from_date ?? undefined,
    p_to_date: filters?.to_date ?? undefined,
  });
  if (error) throw error;
  return dashboardSchema.parse(data);
};

export const fetchDashboardQueryKeys = {
  all: ['dashboard'] as const,
  filters: (filters: QueryParams = {}) =>
    [...fetchDashboardQueryKeys.all, filters] as const,
};

const fetchDashboardQueryOptions = (filters: QueryParams = {}) => {
  return queryOptions({
    queryKey: fetchDashboardQueryKeys.filters(filters),
    queryFn: () => fetchDashboard(filters),
    placeholderData: (previousData) => previousData,
  });
};

type useFetchDashboardParams = {
  queryConfig?: QueryConfig<typeof fetchDashboardQueryOptions>;
  filters?: QueryParams;
};

export const useFetchDashboard = ({
  queryConfig,
  filters,
}: useFetchDashboardParams = {}) => {
  return useQuery({
    ...fetchDashboardQueryOptions(filters),
    ...queryConfig,
  });
};
