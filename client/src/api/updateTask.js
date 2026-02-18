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
    // When mutate is called:
    onMutate: async (newTask, context) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueriesData({ queryKey: ['tasks'] });

      // Optimistically update to the new value
      previousTasks.forEach(([queryKey, oldTasks]) => {
        // We can check filters here if we want to remove the task if it no longer matches,
        // but strictly speaking, simply updating it in place is safer for optimistic updates
        // to avoid UI jumping. Real validation happens on invalidate.
        queryClient.setQueryData(queryKey, (old) => {
          if (!old) return old;
          return old.map((task) => {
            if (task.id === newTask.taskId) {
              return {
                ...task,
                ...newTask.data,
                updated_at: new Date().toISOString(),
                optimistic: true,
              };
            }
            return task;
          });
        });
      });

      params.mutationConfig?.onMutate?.(newTask, context);
      // Return a result with the snapshotted value
      return { previousTasks };
    },
    // If the mutation fails,
    // use the result returned from onMutate to roll back
    onError: (err, newTask, context) => {
      // Rollback all queries
      if (context?.previousTasks) {
        context.previousTasks.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      params.mutationConfig?.onError?.(err, newTask, context);
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
