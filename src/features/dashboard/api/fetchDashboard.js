import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export const fetchDashboard = async (filters = {}) => {
  const response = await api.get('/dashboard', { params: filters });
  return response.data;
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
