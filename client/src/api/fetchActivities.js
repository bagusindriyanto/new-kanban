import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export const fetchActivities = async () => {
  const response = await api.get('/activities.php');
  return response.data;
};

export const fetchActivitiesQueryKey = () => ['activities'];

const fetchActivitiesQueryOptions = () => {
  return queryOptions({
    queryKey: fetchActivitiesQueryKey(),
    queryFn: fetchActivities,
  });
};

export const useFetchActivities = (params = {}) => {
  return useQuery({
    ...fetchActivitiesQueryOptions(),
    ...params.queryConfig,
  });
};
