import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { queryClient } from '@/lib/react-query';
import { fetchTasksQueryKey } from './fetchTasks';

export const addTask = async (data) => {
  const now = new Date().toISOString();
  const response = await api.post('/tasks.php', {
    ...data,
    status: 'todo',
    timestamp_todo: now,
    timestamp_progress: null,
    timestamp_done: null,
    timestamp_archived: null,
    minute_pause: 0,
    minute_activity: 0,
    pause_time: null,
  });
  return response.data;
};

export const useAddTask = (params = {}) => {
  return useMutation({
    mutationFn: addTask,
    ...params.mutationConfig,
    // When mutate is called:
    onMutate: async (newTask, context) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: fetchTasksQueryKey() });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(fetchTasksQueryKey());

      // Optimistically update to the new value
      queryClient.setQueryData(fetchTasksQueryKey(), (oldTasks) => [
        {
          ...newTask,
          status: 'todo',
          timestamp_todo: new Date().toISOString(),
          timestamp_progress: null,
          timestamp_done: null,
          timestamp_archived: null,
          minute_pause: 0,
          minute_activity: 0,
          pause_time: null,
          updated_at: new Date().toISOString(),
          optimistic: true,
        },
        ...oldTasks,
      ]);
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
