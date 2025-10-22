import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { queryClient } from '@/lib/react-query';
import { fetchTasksQueryKey } from './fetchTasks';

export const updateTask = async ({ taskId, data }) => {
  const now = new Date().toISOString();
  const response = await api.patch(`/tasks.php?id=${taskId}`, {
    ...data,
    updated_at: now,
  });
  return response.data;
};

export const useUpdateTask = (params = {}) => {
  return useMutation({
    mutationFn: updateTask,
    ...params.mutationConfig,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: fetchTasksQueryKey() });
      params.mutationConfig?.onSuccess?.(
        data,
        variables,
        onMutateResult,
        context
      );
    },
  });
};
