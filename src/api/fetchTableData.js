import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';

export const fetchTableData = async (filters = {}) => {
  const response = await api.get('/dashboard/table', { params: filters });
  return response.data;
};

export const fetchTableDataQueryKey = (filters = {}) => [
  'dashboard-table',
  filters,
];

const fetchTableDataQueryOptions = (filters = {}) => {
  return queryOptions({
    queryKey: fetchTableDataQueryKey(filters),
    queryFn: () => fetchTableData(filters),
    placeholderData: (previousData) => previousData,
  });
};

export const useFetchTableData = (filters = {}, params = {}) => {
  return useQuery({
    ...fetchTableDataQueryOptions(filters),
    ...params.queryConfig,
  });
};
