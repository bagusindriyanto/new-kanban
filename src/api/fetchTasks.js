import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';

export const fetchTasks = async (filters = {}) => {
  const response = await api.get('/tasks', {
    params: filters,
  });
  return response.data;
};

export const fetchTasksQueryKey = (filters = {}) => ['tasks', filters];

const fetchTasksQueryOptions = (filters = {}) => {
  return queryOptions({
    queryKey: fetchTasksQueryKey(filters),
    queryFn: () => fetchTasks(filters),
    placeholderData: (previousData) => previousData,
  });
};

export const useFetchTasks = (filters = {}, params = {}) => {
  return useQuery({
    ...fetchTasksQueryOptions(filters),
    ...params.queryConfig,
  });
};
