import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export const fetchTableSummary = async () => {
  const response = await api.get('/table_summary.php');
  return response.data;
};

export const fetchTableSummaryQueryKey = () => ['tableSummary'];

const fetchTableSummaryQueryOptions = () => {
  return queryOptions({
    queryKey: fetchTableSummaryQueryKey(),
    queryFn: fetchTableSummary,
  });
};

export const useFetchTableSummary = (params = {}) => {
  return useQuery({
    ...fetchTableSummaryQueryOptions(),
    ...params.queryConfig,
  });
};
