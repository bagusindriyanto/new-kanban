import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { queryClient } from '@/lib/react-query';
import { fetchTasksQueryKey } from './fetchTasks';

export const updateTask = async (data) => {
  const now = new Date().toISOString();
  const response = await api.patch(`/tasks.php?id=${data.id}`, {
    ...data,
    updated_at: now,
  });
  return response.data;
};

export const useUpdateTask = (params = {}) => {
  return useMutation({
    mutationFn: updateTask,
    onMutate: async (updatedTask, context) => {
      await queryClient.cancelQueries({ queryKey: fetchTasksQueryKey() });

      const previousTasks = queryClient.getQueriesData({
        queryKey: fetchTasksQueryKey(),
      });

      previousTasks.forEach(([queryKey, oldTasks]) => {
        if (!oldTasks) return;

        const exist = oldTasks.some((task) => task.id === updatedTask.id);

        if (!exist) return;

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
      return { previousTasks };
    },
    onError: (err, updatedTask, context) => {
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
