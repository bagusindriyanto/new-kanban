import { queryOptions, useQuery } from '@tanstack/react-query';
import useAuthStore from '@/stores/authStore';
import { supabase } from '@/lib/supabase';

export const fetchUpcomingTasks = async (userId) => {
  const { data, error } = await supabase
    .from('tasks')
    .select(
      `
      id,
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

  if (error) throw error;
  return data;
};

export const fetchUpcomingTasksQueryKey = () => ['upcoming-tasks'];

const fetchUpcomingTasksQueryOptions = (userId) => {
  return queryOptions({
    queryKey: fetchUpcomingTasksQueryKey(),
    queryFn: () => fetchUpcomingTasks(userId),
    enabled: !!userId,
    refetchInterval: 60 * 1000,
  });
};

export const useFetchUpcomingTasks = (params = {}) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const userId = currentUser?.id;

  return useQuery({
    ...fetchUpcomingTasksQueryOptions(userId),
    ...params.queryConfig,
  });
};
