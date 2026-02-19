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
    // When mutate is called:
    onMutate: async (taskId, context) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: fetchTasksQueryKey() });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueriesData({
        queryKey: fetchTasksQueryKey(),
      });

      // Optimistically update to the new value
      previousTasks.forEach(([queryKey, oldTasks]) => {
        if (!oldTasks) return;

        const existingTask = oldTasks.some((task) => task.id === taskId);
        if (!existingTask) return;

        queryClient.setQueryData(
          queryKey,
          oldTasks.filter((task) => task.id !== taskId),
        );
      });

      params.mutationConfig?.onMutate?.(taskId, context);
      // Return a result with the snapshotted value
      return { previousTasks };
    },
    // If the mutation fails,
    // use the result returned from onMutate to roll back
    onError: (err, taskId, context) => {
      // Rollback all queries
      context?.previousTasks.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      params.mutationConfig?.onError?.(err, taskId, context);
    },
    onSettled: (data, error, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: fetchTasksQueryKey() });

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
