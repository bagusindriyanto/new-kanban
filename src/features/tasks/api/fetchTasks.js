import { queryOptions, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const fetchTasks = async (filters = {}) => {
  const { user_id, from_date, to_date } = filters;

  let query = supabase.from('tasks').select(`
    *,
    user:profiles!profile_id (full_name, name, avatar),
    assigner:profiles!assigner_id (name)
    `);

  if (user_id) {
    query = query.eq('profile_id', user_id);
  }

  if (from_date && to_date) {
    query = query
      .gte('timestamp_progress', from_date)
      .lte('timestamp_progress', to_date);
  }

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
