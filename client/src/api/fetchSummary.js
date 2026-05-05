import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export const fetchSummary = async (filters = {}) => {
  const response = await api.get('/dashboard/stats', { params: filters });
  return response.data;
};

export const fetchSummaryQueryKey = (filters = {}) => [
  'dashboard-stats',
  filters,
];

const fetchSummaryQueryOptions = (filters = {}) => {
  return queryOptions({
    queryKey: fetchSummaryQueryKey(filters),
    queryFn: () => fetchSummary(filters),
    placeholderData: (previousData) => previousData,
  });
};

export const useFetchSummary = (filters = {}, params = {}) => {
  return useQuery({
    ...fetchSummaryQueryOptions(filters),
    ...params.queryConfig,
  });
};
