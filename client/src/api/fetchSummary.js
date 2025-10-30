import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export const fetchSummary = async () => {
  const response = await api.get('/summary.php');
  return response.data;
};

export const fetchSummaryQueryKey = () => ['summary'];

const fetchSummaryQueryOptions = () => {
  return queryOptions({
    queryKey: fetchSummaryQueryKey(),
    queryFn: fetchSummary,
  });
};

export const useFetchSummary = (params = {}) => {
  return useQuery({
    ...fetchSummaryQueryOptions(),
    ...params.queryConfig,
  });
};
