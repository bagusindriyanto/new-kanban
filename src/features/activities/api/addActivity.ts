import { useMutation } from '@tanstack/react-query';
import type { MutationConfig } from '@/lib/queryClient';
import { supabase } from '@/lib/supabase';
import type { ActivityInsert } from '@/types/activity';
import { activityKeys } from './queryKeys';

export const addActivity = async (data: ActivityInsert) => {
  const { name } = data;

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
      context.client.invalidateQueries({ queryKey: activityKeys.all });

      params.mutationConfig?.onSuccess?.(
        data,
        variables,
        onMutateResult,
        context,
      );
    },
  });
};
