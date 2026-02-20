import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { queryClient } from '@/lib/react-query';
import { fetchTasksQueryKey } from './fetchTasks';

export const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks.php?id=${taskId}`);
  return response.data;
};

export const useDeleteTask = (params = {}) => {
  return useMutation({
    mutationFn: deleteTask,
    onMutate: async (taskId, context) => {
      await queryClient.cancelQueries({ queryKey: fetchTasksQueryKey() });

      const previousTasks = queryClient.getQueriesData({
        queryKey: fetchTasksQueryKey(),
      });

      previousTasks.forEach(([queryKey, oldTasks]) => {
        if (!oldTasks) return;

        const exist = oldTasks.some((task) => task.id === taskId);
        if (!exist) return;

        queryClient.setQueryData(
          queryKey,
          oldTasks.filter((task) => task.id !== taskId),
        );
      });

      params.mutationConfig?.onMutate?.(taskId, context);
      return { previousTasks };
    },
    onError: (err, taskId, context) => {
      context?.previousTasks.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      params.mutationConfig?.onError?.(err, taskId, context);
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
