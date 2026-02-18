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

      // Optimistically update
      queryClient.setQueriesData({ queryKey: ['tasks'] }, (oldTasks, query) => {
        if (!oldTasks) return [];

        // Check filtering
        const [_key, filters] = query.queryKey;
        if (
          filters?.picId &&
          filters.picId !== 'all' &&
          filters.picId != newTask.pic_id
        ) {
          return oldTasks;
        }

        return [
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
        ];
      });

      params.mutationConfig?.onMutate?.(newTask, context);
      return { previousTasks };
    },
    onError: (err, newTask, onMutateResult, context) => {
      // Rollback
      onMutateResult.previousTasks.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      params.mutationConfig?.onError?.(err, newTask, onMutateResult, context);
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
  });
};
