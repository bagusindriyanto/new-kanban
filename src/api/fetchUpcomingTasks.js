import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';

export const fetchUpcomingTasks = async () => {
  const response = await api.get('/tasks/upcoming');
  return response.data;
};

export const fetchUpcomingTasksQueryKey = () => ['upcoming-tasks'];

const fetchUpcomingTasksQueryOptions = () => {
  return queryOptions({
    queryKey: fetchUpcomingTasksQueryKey(),
    queryFn: fetchUpcomingTasks,
    refetchInterval: 45 * 1000,
    staleTime: 15 * 1000,
    select: (tasks) => {
      const now = new Date();
      const in30min = new Date(now.getTime() + 30 * 60_000);
      return tasks
        .filter((task) => {
          const start = new Date(task.scheduled_at);
          return start >= now && start <= in30min;
        })
        .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));
    },
    // placeholderData: (previousData) => previousData,
  });
};

export const useFetchUpcomingTasks = (params = {}) => {
  return useQuery({
    ...fetchUpcomingTasksQueryOptions(),
    ...params.queryConfig,
  });
};
