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
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueriesData({ queryKey: ['tasks'] });

      // Optimistically update
      queryClient.setQueriesData({ queryKey: ['tasks'] }, (oldTasks) =>
        oldTasks?.filter((task) => task.id !== taskId),
      );
      params.mutationConfig?.onMutate?.(taskId, context);
      // Return a result with the snapshotted value
      return { previousTasks };
    },
    // If the mutation fails,
    // use the result returned from onMutate to roll back
    onError: (err, taskId, onMutateResult, context) => {
      onMutateResult.previousTasks.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      params.mutationConfig?.onError?.(err, taskId, onMutateResult, context);
    },
    onSettled: (data, error, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      params.mutationConfig?.onSettled?.(
        data,
        error,
        variables,
        onMutateResult,
        context,
      );
    },
  });
};
