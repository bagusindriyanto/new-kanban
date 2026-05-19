import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';

export const fetchChartData = async (filters = {}) => {
  const response = await api.get('/dashboard/chart', { params: filters });
  return response.data;
};

export const fetchChartDataQueryKey = (filters = {}) => [
  'dashboard-chart',
  filters,
];

const fetchChartDataQueryOptions = (filters = {}) => {
  return queryOptions({
    queryKey: fetchChartDataQueryKey(filters),
    queryFn: () => fetchChartData(filters),
    placeholderData: (previousData) => previousData,
  });
};

export const useFetchChartData = (filters = {}, params = {}) => {
  return useQuery({
    ...fetchChartDataQueryOptions(filters),
    ...params.queryConfig,
  });
};
