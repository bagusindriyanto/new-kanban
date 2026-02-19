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
    // When mutate is called:
    onMutate: async (updatedTask, context) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: fetchTasksQueryKey() });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueriesData({
        queryKey: fetchTasksQueryKey(),
      });

      // Optimistically update to the new value
      previousTasks.forEach(([queryKey, oldTasks]) => {
        console.log(queryKey, oldTasks);
        if (!oldTasks) return;

        const existingTask = oldTasks.some(
          (task) => task.id === updatedTask.id,
        );
        if (!existingTask) return;

        queryClient.setQueryData(
          queryKey,
          oldTasks.map((task) =>
            task.id === updatedTask.id
              ? {
                  ...task,
                  ...updatedTask,
                  optimistic: true,
                }
              : task,
          ),
        );
      });

      params.mutationConfig?.onMutate?.(updatedTask, context);
      // Return a result with the snapshotted value
      return { previousTasks };
    },
    // If the mutation fails,
    // use the result returned from onMutate to roll back
    onError: (err, updatedTask, context) => {
      // Rollback all queries
      context?.previousTasks.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      params.mutationConfig?.onError?.(err, updatedTask, context);
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
