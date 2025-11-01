import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export const fetchPics = async () => {
  const response = await api.get('/pics.php');
  return response.data;
};

export const fetchPicsQueryKey = () => ['pics'];

const fetchPicsQueryOptions = () => {
  return queryOptions({
    queryKey: fetchPicsQueryKey(),
    queryFn: fetchPics,
  });
};

export const useFetchPics = (params = {}) => {
  return useQuery({
    ...fetchPicsQueryOptions(),
    ...params.queryConfig,
  });
};
