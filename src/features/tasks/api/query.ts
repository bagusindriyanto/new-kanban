import { supabase } from '@/lib/supabase';
import type { QueryData } from '@supabase/supabase-js';
import type { TaskFilters } from '../hooks/useTaskFilters';

export const tasksWithProfileQuery = (filters: TaskFilters) => {
  let query = supabase.from('tasks').select(`
    *,
    user:profiles!tasks_user_id_fkey (user_id, full_name, name, avatar),
    assigner:profiles!tasks_assigner_id_fkey (name)
  `);

  const { user_id, from_date, to_date } = filters;

  if (user_id !== 'all') {
    query = query.eq('user_id', user_id);
  }

  if (from_date && to_date) {
    query = query.or(
      `status.in.("todo","on progress"),and(timestamp_done.gte.${from_date},timestamp_done.lte.${to_date})`,
    );
  }

  return query.order('updated_at', { ascending: false });
};
export type TaskWithProfile = QueryData<
  ReturnType<typeof tasksWithProfileQuery>
>[number] & {
  optimistic?: boolean;
};
