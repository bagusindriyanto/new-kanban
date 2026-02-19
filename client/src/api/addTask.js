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
    // When mutate is called:
    onMutate: async (newTask, context) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: fetchTasksQueryKey() });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueriesData({
        queryKey: fetchTasksQueryKey(),
      });

      // Optimistically update to the new value
      // We iterate over the existing queries to access their query keys (filters)
      previousTasks.forEach(([queryKey, oldTasks]) => {
        console.log(queryKey, oldTasks);
        if (!oldTasks) return;

        const filters = queryKey[1];
        if (!filters) return;

        const matchedFilter =
          filters?.pic_id &&
          filters.pic_id !== 'all' &&
          Number(filters.pic_id) !== Number(newTask.pic_id);

        // Apply pic_id filter
        if (!matchedFilter) return;

        // New tasks are always "todo" so we generally include them unless filtered out by PIC.
        queryClient.setQueryData(queryKey, [
          {
            ...newTask,
            optimistic: true,
          },
          ...oldTasks,
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
      context?.previousTasks.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      params.mutationConfig?.onError?.(err, newTask, context);
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
