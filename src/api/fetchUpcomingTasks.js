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
    placeholderData: (previousData) => previousData,
  });
};

export const useFetchUpcomingTasks = (params = {}) => {
  return useQuery({
    ...fetchUpcomingTasksQueryOptions(),
    ...params.queryConfig,
  });
};
