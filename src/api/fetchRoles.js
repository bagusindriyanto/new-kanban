import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';

export const fetchRoles = async () => {
  const response = await api.get('/roles');
  return response.data;
};

export const fetchRolesQueryKey = () => ['roles'];

const fetchRolesQueryOptions = () => {
  return queryOptions({
    queryKey: fetchRolesQueryKey(),
    queryFn: fetchRoles,
  });
};

export const useFetchRoles = (params = {}) => {
  return useQuery({
    ...fetchRolesQueryOptions(),
    ...params.queryConfig,
  });
};
