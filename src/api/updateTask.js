import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { queryClient } from '@/lib/queryClient';
import { fetchTasksQueryKey } from './fetchTasks';

export const updateTask = async (data) => {
  const response = await api.put(`/tasks/${data.id}`, data);
  return response.data;
};

export const useUpdateTask = (params = {}) => {
  const { mutationConfig = {} } = params;
  const { onMutate, onError, onSettled, ...restMutationConfig } =
    mutationConfig;

  return useMutation({
    mutationFn: updateTask,
    onMutate: async (updatedTask) => {
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
          oldTasks
            .map((task) =>
              task.id === updatedTask.id
                ? {
                    ...task,
                    ...updatedTask,
                    optimistic: true,
                  }
                : task,
            )
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)),
        );
      });

      const customContext = await onMutate?.(updatedTask);
      return { previousTasks, ...customContext };
    },
    onError: (err, updatedTask, context) => {
      context?.previousTasks.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      onError?.(err, updatedTask, context);
    },
    onSettled: (data, error, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: fetchTasksQueryKey() });

      onSettled?.(data, error, variables, onMutateResult, context);
    },

    ...restMutationConfig,
  });
};
