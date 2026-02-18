import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export const fetchTasks = async (filters = {}) => {
  const response = await api.get('/tasks.php', {
    params: filters,
  });
  return response.data;
};

export const fetchTasksQueryKey = (filters = {}) => ['tasks', filters];

const fetchTasksQueryOptions = (filters = {}) => {
  return queryOptions({
    queryKey: fetchTasksQueryKey(filters),
    queryFn: () => fetchTasks(filters),
  });
};

export const useFetchTasks = (filters = {}, params = {}) => {
  return useQuery({
    ...fetchTasksQueryOptions(filters),
    ...params.queryConfig,
  });
};
