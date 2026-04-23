import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export const fetchDivisions = async () => {
  const response = await api.get('/divisions');
  return response.data;
};

export const fetchDivisionsQueryKey = () => ['divisions'];

const fetchDivisionsQueryOptions = () => {
  return queryOptions({
    queryKey: fetchDivisionsQueryKey(),
    queryFn: fetchDivisions,
  });
};

export const useFetchDivisions = (params = {}) => {
  return useQuery({
    ...fetchDivisionsQueryOptions(),
    ...params.queryConfig,
  });
};
