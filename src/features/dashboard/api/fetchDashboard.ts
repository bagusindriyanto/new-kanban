import { queryOptions, useQuery } from '@tanstack/react-query';
import type { DashboardFilters } from '../hooks/useDashboardFilters';
import type { QueryConfig } from '@/lib/queryClient';
import { dashboardSchema } from '../schemas/dashboardSchema';
import { dashboardKeys } from './queryKeys';
import { dashboardQuery } from './query';

export const fetchDashboard = async (filters: DashboardFilters = {}) => {
  const { data, error } = await dashboardQuery(filters);
  if (error) throw error;
  return dashboardSchema.parse(data);
};

const fetchDashboardQueryOptions = (filters: DashboardFilters = {}) => {
  return queryOptions({
    queryKey: dashboardKeys.filters(filters),
    queryFn: () => fetchDashboard(filters),
    placeholderData: (previousData) => previousData,
  });
};

type useFetchDashboardParams = {
  queryConfig?: QueryConfig<typeof fetchDashboardQueryOptions>;
  filters?: DashboardFilters;
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
