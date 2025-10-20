import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { queryClient } from '@/lib/react-query';
import { fetchTasksQueryKey } from './fetchTasks';

export const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks.php?id=${taskId}`);
  return response.data;
};

export const useDeleteTask = (params = {}) => {
  return useMutation({
    mutationFn: deleteTask,
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
