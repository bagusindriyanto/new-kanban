import { queryOptions, useQuery } from '@tanstack/react-query';
import type { QueryConfig } from '@/lib/queryClient';
import { upcomingTasksQuery } from './query';
import { upcomingTaskKeys } from './queryKeys';
import useAuthStore from '@/stores/authStore';

export const fetchUpcomingTasks = async (userId: string) => {
  const { data, error } = await upcomingTasksQuery(userId);
  if (error) throw error;
  return data;
};

const fetchUpcomingTasksQueryOptions = (userId: string) => {
  return queryOptions({
    queryKey: upcomingTaskKeys.detail(userId),
    queryFn: () => fetchUpcomingTasks(userId),
    enabled: !!userId,
    refetchInterval: 60 * 1000,
  });
};

type UseFetchUpcomingTasksParams = {
  queryConfig?: QueryConfig<typeof fetchUpcomingTasksQueryOptions>;
};

export const useFetchUpcomingTasks = ({
  queryConfig,
}: UseFetchUpcomingTasksParams = {}) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const userId = currentUser?.id;

  return useQuery({
    ...fetchUpcomingTasksQueryOptions(userId!),
    ...queryConfig,
  });
};
