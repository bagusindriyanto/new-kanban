import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { fetchActivitiesQueryKey } from './fetchActivities';
import { supabase } from '@/lib/supabase';

export const addActivity = async (data) => {
  const { activity } = data;
  if (!activity) throw new Error('Nama aktivitas tidak boleh kosong');

  const { error } = await supabase
    .from('activities')
    .insert({ name: activity });
  if (error) throw error;
};

export const useAddActivity = (params = {}) => {
  return useMutation({
    mutationFn: addActivity,
    onSettled: (data, error, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: fetchActivitiesQueryKey() });

      params.mutationConfig?.onSettled?.(
        data,
        error,
        variables,
        onMutateResult,
        context,
      );
    },
    ...params.mutationConfig,
  });
};
