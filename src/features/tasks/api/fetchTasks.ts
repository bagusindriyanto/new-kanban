import { queryOptions, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { QueryConfig } from '@/lib/queryClient';
import type { QueryData } from '@supabase/supabase-js';
import type { QueryParams } from '../hooks/useTaskFilters';

const buildFetchTasksQuery = (filters: QueryParams) => {
  const { user_id, from_date, to_date } = filters;

  let query = supabase.from('tasks').select(`
    *,
    user:profiles!tasks_user_id_fkey (user_id, full_name, name, avatar),
    assigner:profiles!tasks_assigner_id_fkey (name)
    `);

  if (user_id !== 'all') {
    query = query.eq('user_id', user_id);
  }

  if (from_date && to_date) {
    query = query.or(
      `status.eq.todo,and(timestamp_progress.gte.${from_date},timestamp_progress.lte.${to_date})`,
    );
  }

  query = query.order('updated_at', { ascending: false });

  return query;
};

export type TasksQueryResult = QueryData<
  ReturnType<typeof buildFetchTasksQuery>
>;

export type TaskQueryResult = TasksQueryResult[number] & {
  optimistic?: boolean;
};
export type OptimisticTaskQueryResult = TaskQueryResult & {
  optimistic: boolean;
};

export const fetchTasks = async (filters: QueryParams) => {
  const { data, error } = await buildFetchTasksQuery(filters);
  if (error) throw error;
  return data;
};

export const fetchTasksQueryKeys = {
  all: ['tasks'] as const,
  filters: (filters: QueryParams) =>
    [...fetchTasksQueryKeys.all, filters] as const,
};

export type TasksQueryKey = ReturnType<typeof fetchTasksQueryKeys.filters>;

const fetchTasksQueryOptions = (filters: QueryParams) => {
  return queryOptions({
    queryKey: fetchTasksQueryKeys.filters(filters),
    queryFn: () => fetchTasks(filters),
    placeholderData: (previousData) => previousData,
  });
};

type UseFetchTasksParams = {
  queryConfig?: QueryConfig<typeof fetchTasksQueryOptions>;
  filters: QueryParams;
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
