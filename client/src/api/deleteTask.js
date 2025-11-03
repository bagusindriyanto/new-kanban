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
    // When mutate is called:
    onMutate: async (taskId, context) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: fetchTasksQueryKey() });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(fetchTasksQueryKey());

      // Optimistically update to the new value
      queryClient.setQueryData(fetchTasksQueryKey(), (oldTasks) =>
        oldTasks?.filter((task) => task.id !== taskId)
      );
      params.mutationConfig?.onMutate?.(taskId, context);
      // Return a result with the snapshotted value
      return { previousTasks };
    },
    // If the mutation fails,
    // use the result returned from onMutate to roll back
    onError: (err, taskId, onMutateResult, context) => {
      queryClient.setQueryData(
        fetchTasksQueryKey(),
        onMutateResult.previousTasks
      );
      params.mutationConfig?.onError?.(err, taskId, onMutateResult, context);
    },
    onSettled: (data, error, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: fetchTasksQueryKey() });
      params.mutationConfig?.onSettled?.(
        data,
        error,
        variables,
        onMutateResult,
        context
      );
    },
  });
};
