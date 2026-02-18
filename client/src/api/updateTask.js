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

      // Optimistically update
      queryClient.setQueriesData({ queryKey: ['tasks'] }, (oldTasks) =>
        oldTasks?.map((task) =>
          task.id === newTask.taskId
            ? {
                ...task,
                ...newTask.data,
                updated_at: new Date().toISOString(),
                optimistic: true,
              }
            : task,
        ),
      );
      params.mutationConfig?.onMutate?.(newTask, context);
      // Return a result with the snapshotted value
      return { previousTasks };
    },
    // If the mutation fails,
    // use the result returned from onMutate to roll back
    onError: (err, newTask, onMutateResult, context) => {
      onMutateResult.previousTasks.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      params.mutationConfig?.onError?.(err, newTask, onMutateResult, context);
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
