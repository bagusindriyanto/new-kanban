import { queryOptions, useQuery } from '@tanstack/react-query';
import type { QueryConfig } from '@/lib/queryClient';
import { supabase } from '@/lib/supabase';
import { workTimeKeys, type WorkTimeData } from './queryKeys';
import useAuthStore from '@/stores/authStore';
import { format } from 'date-fns';

const fetchWorkTime = async (userId: string, date: string) => {
  const { data, error } = await supabase
    .from('work_times')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .maybeSingle();

  if (error) throw error;
  return data;
};

const fetchWorkTimeQueryOptions = (userId: string, date: string) => {
  return queryOptions({
    queryKey: workTimeKeys.currentUser(userId, date),
    queryFn: () => fetchWorkTime(userId, date),
    enabled: !!userId,
  });
};

type UseFetchWorkTimeParams = {
  queryConfig?: QueryConfig<typeof fetchWorkTimeQueryOptions>;
};

export const useFetchWorkTime = ({
  queryConfig,
}: UseFetchWorkTimeParams = {}) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const userId = currentUser?.id;
  const today = format(new Date(), 'yyyy-MM-dd');

  return useQuery({
    ...fetchWorkTimeQueryOptions(userId!, today),
    ...queryConfig,
  });
};

export type { WorkTimeData };
