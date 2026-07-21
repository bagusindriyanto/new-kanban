import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { fetchTasksQueryKey } from './fetchTasks';
import { supabase } from '@/lib/supabase';

export const deleteTask = async (taskId) => {
  const { error } = await supabase.from('tasks').delete().eq('id', taskId);
  if (error) throw error;
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
