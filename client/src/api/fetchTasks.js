import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export const fetchTasks = async () => {
  const response = await api.get('/tasks.php');
  return response.data;
};

export const fetchTasksQueryKey = () => ['tasks'];

const fetchTasksQueryOptions = () => {
  return queryOptions({
    queryKey: fetchTasksQueryKey(),
    queryFn: fetchTasks,
  });
};

export const useFetchTasks = (params = {}) => {
  return useQuery({
    ...fetchTasksQueryOptions(),
    ...params.queryConfig,
  });
};
