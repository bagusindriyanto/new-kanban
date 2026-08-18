import { queryOptions, useQuery } from '@tanstack/react-query';
import type { QueryConfig } from '@/lib/queryClient';
import { activitiesQuery } from './query';
import { activityKeys } from './queryKeys';

export const fetchActivities = async () => {
  const { data, error } = await activitiesQuery();
  if (error) throw error;
  return data;
};

const fetchActivitiesQueryOptions = () => {
  return queryOptions({
    queryKey: activityKeys.all,
    queryFn: fetchActivities,
  });
};

type UseFetchActivitiesParams = {
  queryConfig?: QueryConfig<typeof fetchActivitiesQueryOptions>;
};

export const useFetchActivities = ({
  queryConfig,
}: UseFetchActivitiesParams = {}) => {
  return useQuery({
    ...fetchActivitiesQueryOptions(),
    ...queryConfig,
  });
};
