import { queryOptions, useQuery } from '@tanstack/react-query';
import useAuthStore from '@/stores/authStore';
import { supabase } from '@/lib/supabase';
import type { QueryConfig } from '@/lib/queryClient';
import type { QueryData } from '@supabase/supabase-js';

const buildFetchUpcomingTasksQuery = (userId: string) => {
  return supabase
    .from('tasks')
    .select(
      `
      id,
      status,
      content,
      detail,
      scheduled_at
      `,
    )
    .eq('user_id', userId)
    .eq('status', 'todo')
    .gte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true })
    .limit(10);
};

export const fetchUpcomingTasks = async (userId: string) => {
  const { data, error } = await buildFetchUpcomingTasksQuery(userId);

  if (error) throw error;
  return data;
};

export type UpcomingTasksQueryResult = QueryData<
  ReturnType<typeof buildFetchUpcomingTasksQuery>
>;

export type UpcomingTaskQueryResult = UpcomingTasksQueryResult[number];

export const fetchUpcomingTasksQueryKey = () => ['upcoming-tasks'];

const fetchUpcomingTasksQueryOptions = (userId: string) => {
  return queryOptions({
    queryKey: fetchUpcomingTasksQueryKey(),
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
    ...fetchUpcomingTasksQueryOptions(userId),
    ...queryConfig,
  });
};
