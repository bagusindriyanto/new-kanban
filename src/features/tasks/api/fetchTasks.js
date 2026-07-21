import { queryOptions, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const fetchTasks = async (filters = {}) => {
  const { user_id, from_date, to_date } = filters;

  let query = supabase.from('tasks').select(`
    *,
    user:profiles!tasks_user_id_fkey (id:user_id, full_name, name, avatar),
    assigner:profiles!tasks_assigner_id_fkey (name)
    `);

  if (user_id) {
    query = query.eq('user_id', user_id);
  }

  if (from_date && to_date) {
    query = query.or(
      `status.eq.todo,and(timestamp_progress.gte.${from_date},timestamp_progress.lte.${to_date})`,
    );
  }

  query = query.order('updated_at', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return data;
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
