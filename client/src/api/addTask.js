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
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueriesData({ queryKey: ['tasks'] });

      // Optimistically update to the new value
      // We iterate over the existing queries to access their query keys (filters)
      previousTasks.forEach(([queryKey, oldTasks]) => {
        const filters = queryKey[1];

        // Apply pic_id filter
        if (
          filters?.pic_id &&
          filters.pic_id !== 'all' &&
          Number(filters.pic_id) !== Number(newTask.pic_id)
        ) {
          return; // Don't update this cache
        }

        // New tasks are always "todo" so we generally include them unless filtered out by PIC.
        queryClient.setQueryData(queryKey, [
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
          ...(oldTasks || []),
        ]);
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
