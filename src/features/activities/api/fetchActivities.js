import { queryOptions, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const fetchActivities = async () => {
  const { data, error } = await supabase
    .from('activities')
    .select('id, name')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const fetchActivitiesQueryKey = () => ['activities'];

const fetchActivitiesQueryOptions = () => {
  return queryOptions({
    queryKey: fetchActivitiesQueryKey(),
    queryFn: fetchActivities,
  });
};

export const useFetchActivities = (params = {}) => {
  return useQuery({
    ...fetchActivitiesQueryOptions(),
    ...params.queryConfig,
  });
};
