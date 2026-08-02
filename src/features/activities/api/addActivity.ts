import { useMutation } from '@tanstack/react-query';
import { queryClient, type MutationConfig } from '@/lib/queryClient';
import { fetchActivitiesQueryKey } from './fetchActivities';
import { supabase } from '@/lib/supabase';
import type { ActivityInsert } from '@/types/activity';

export const addActivity = async (data: ActivityInsert) => {
  const { name } = data;
  if (!name) throw new Error('Nama aktivitas tidak boleh kosong');

  const { error } = await supabase.from('activities').insert({ name });
  if (error) throw error;
};

type UseAddActivityParams = {
  mutationConfig?: MutationConfig<typeof addActivity>;
};

export const useAddActivity = (params: UseAddActivityParams = {}) => {
  return useMutation({
    ...params.mutationConfig,
    mutationFn: addActivity,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: fetchActivitiesQueryKey() });

      params.mutationConfig?.onSuccess?.(
        data,
        variables,
        onMutateResult,
        context,
      );
    },
  });
};
