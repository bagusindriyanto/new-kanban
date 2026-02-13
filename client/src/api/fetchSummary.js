import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export const fetchSummary = async (filters = {}) => {
  const response = await api.get('/summary.php', { params: filters });
  return response.data;
};

export const fetchSummaryQueryKey = (filters = {}) => ['summary', filters];

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
