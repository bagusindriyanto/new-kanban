import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { queryClient } from '@/lib/react-query';
import { fetchTasksQueryKey } from './fetchTasks';

export const addTask = async ({ content, pic_id, detail }) => {
  const now = new Date().toISOString();
  const response = await api.post('/tasks.php', {
    content,
    pic_id,
    detail,
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
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: fetchTasksQueryKey() });
      params.mutationConfig?.onSuccess?.(
        data,
        variables,
        onMutateResult,
        context
      );
    },
  });
};
