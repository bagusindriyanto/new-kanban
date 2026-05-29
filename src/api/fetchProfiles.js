import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';

export const fetchProfiles = async () => {
  const response = await api.get('/profiles');
  return response.data;
};

export const fetchProfilesQueryKey = () => ['profiles'];

const fetchProfilesQueryOptions = () => {
  return queryOptions({
    queryKey: fetchProfilesQueryKey(),
    queryFn: fetchProfiles,
  });
};

export const useFetchProfiles = (params = {}) => {
  return useQuery({
    ...fetchProfilesQueryOptions(),
    ...params.queryConfig,
  });
};
