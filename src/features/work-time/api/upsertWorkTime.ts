import { useMutation } from '@tanstack/react-query';
import type { MutationConfig } from '@/lib/queryClient';
import { supabase } from '@/lib/supabase';
import type { WorkTimeInsert } from '@/types/workTime';
import { workTimeKeys } from './queryKeys';

const upsertWorkTime = async (payload: WorkTimeInsert) => {
  const { error } = await supabase
    .from('work_times')
    .upsert(payload, { onConflict: 'user_id,date' });
  if (error) throw error;
};

type UseUpsertWorkTimeParams = {
  mutationConfig?: Omit<
    MutationConfig<typeof upsertWorkTime>,
    'mutationFn' | 'onSuccess'
  >;
};

export const useUpsertWorkTime = (params: UseUpsertWorkTimeParams = {}) => {
  return useMutation({
    mutationFn: upsertWorkTime,
    onSuccess: (_data, _variables, _onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: workTimeKeys.all,
      });
    },
    ...params.mutationConfig,
  });
};
