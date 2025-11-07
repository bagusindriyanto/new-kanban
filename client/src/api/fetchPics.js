import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export const fetchPICs = async () => {
  const response = await api.get('/pics.php');
  return response.data;
};

export const fetchPICsQueryKey = () => ['pics'];

const fetchPICsQueryOptions = () => {
  return queryOptions({
    queryKey: fetchPICsQueryKey(),
    queryFn: fetchPICs,
  });
};

export const useFetchPICs = (params = {}) => {
  return useQuery({
    ...fetchPICsQueryOptions(),
    ...params.queryConfig,
  });
};
