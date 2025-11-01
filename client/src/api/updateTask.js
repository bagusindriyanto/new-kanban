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
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: fetchTasksQueryKey() });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(fetchTasksQueryKey());

      // Optimistically update to the new value
      queryClient.setQueryData(fetchTasksQueryKey(), (oldTasks) =>
        oldTasks?.map((task) =>
          task.id === newTask.taskId
            ? {
                ...task,
                ...newTask.data,
                updated_at: new Date().toISOString(),
                optimistic: true,
              }
            : task
        )
      );
      params.mutationConfig?.onMutate?.(newTask, context);
      // Return a result with the snapshotted value
      return { previousTasks };
    },
    // If the mutation fails,
    // use the result returned from onMutate to roll back
    onError: (err, newTask, onMutateResult, context) => {
      queryClient.setQueryData(
        fetchTasksQueryKey(),
        onMutateResult.previousTasks
      );
      params.mutationConfig?.onError?.(err, newTask, onMutateResult, context);
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
