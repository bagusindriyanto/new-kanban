import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { queryClient } from '@/lib/queryClient';
import { fetchActivitiesQueryKey } from './fetchActivities';

export const addActivity = async (data) => {
  const response = await api.post('/activities', data);
  return response.data;
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
