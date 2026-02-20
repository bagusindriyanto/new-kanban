import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { queryClient } from '@/lib/react-query';
import { fetchTasksQueryKey } from './fetchTasks';

export const addTask = async (data) => {
  const response = await api.post('/tasks.php', data);
  return response.data;
};

export const useAddTask = (params = {}) => {
  return useMutation({
    mutationFn: addTask,
    onMutate: async (newTask, context) => {
      await queryClient.cancelQueries({ queryKey: fetchTasksQueryKey() });

      const previousTasks = queryClient.getQueriesData({
        queryKey: fetchTasksQueryKey(),
      });

      previousTasks.forEach(([queryKey, oldTasks]) => {
        if (!oldTasks) return;

        const filters = queryKey[1];
        if (!filters) return;

        const matchedFilter =
          !filters?.pic_id || Number(filters.pic_id) === Number(newTask.pic_id);

        if (!matchedFilter) return;

        queryClient.setQueryData(queryKey, [
          {
            ...newTask,
            optimistic: true,
          },
          ...oldTasks,
        ]);
      });

      params.mutationConfig?.onMutate?.(newTask, context);
      return { previousTasks };
    },
    onError: (err, newTask, context) => {
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
