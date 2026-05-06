import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export const fetchStats = async (filters = {}) => {
  const response = await api.get('/dashboard/stats', { params: filters });
  return response.data;
};

export const fetchStatsQueryKey = (filters = {}) => [
  'dashboard-stats',
  filters,
];

const fetchStatsQueryOptions = (filters = {}) => {
  return queryOptions({
    queryKey: fetchStatsQueryKey(filters),
    queryFn: () => fetchStats(filters),
    placeholderData: (previousData) => previousData,
  });
};

export const useFetchStats = (filters = {}, params = {}) => {
  return useQuery({
    ...fetchStatsQueryOptions(filters),
    ...params.queryConfig,
  });
};
