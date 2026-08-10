import { queryOptions, useQuery } from '@tanstack/react-query';
import type { QueryConfig } from '@/lib/queryClient';
import { tasksWithProfileQuery } from './query';
import { taskKeys } from './queryKeys';
import type { TaskFilters } from '../hooks/useTaskFilters';

export const fetchTasks = async (filters: TaskFilters) => {
  const { data, error } = await tasksWithProfileQuery(filters);
  if (error) throw error;
  return data;
};

const fetchTasksQueryOptions = (filters: TaskFilters) => {
  return queryOptions({
    queryKey: taskKeys.filters(filters),
    queryFn: () => fetchTasks(filters),
    placeholderData: (previousData) => previousData,
  });
};

type UseFetchTasksParams = {
  queryConfig?: QueryConfig<typeof fetchTasksQueryOptions>;
  filters: TaskFilters;
};

export const useFetchTasks = ({
  queryConfig,
  filters,
}: UseFetchTasksParams) => {
  return useQuery({
    ...fetchTasksQueryOptions(filters),
    ...queryConfig,
  });
};
