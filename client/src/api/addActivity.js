import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { queryClient } from '@/lib/react-query';
import { fetchActivitiesQueryKey } from './fetchActivities';

export const addActivity = async (name) => {
  const response = await api.post('/activities.php', { name });
  return response.data;
};

export const useAddActivity = (params = {}) => {
  return useMutation({
    mutationFn: addActivity,
    ...params.mutationConfig,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: fetchActivitiesQueryKey() });
      params.mutationConfig?.onSuccess?.(
        data,
        variables,
        onMutateResult,
        context
      );
    },
  });
};
