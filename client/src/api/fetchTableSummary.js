import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export const fetchTableSummary = async (filters = {}) => {
  const response = await api.get('/dashboard/table', { params: filters });
  return response.data;
};

export const fetchTableSummaryQueryKey = (filters = {}) => [
  'dashboard-table',
  filters,
];

const fetchTableSummaryQueryOptions = (filters = {}) => {
  return queryOptions({
    queryKey: fetchTableSummaryQueryKey(filters),
    queryFn: () => fetchTableSummary(filters),
    placeholderData: (previousData) => previousData,
  });
};

export const useFetchTableSummary = (filters = {}, params = {}) => {
  return useQuery({
    ...fetchTableSummaryQueryOptions(filters),
    ...params.queryConfig,
  });
};
