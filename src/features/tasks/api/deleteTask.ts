import { useMutation } from '@tanstack/react-query';
import { type MutationConfig } from '@/lib/queryClient';
import {
  fetchTasksQueryKeys,
  type TasksQueryKey,
  type TasksQueryResult,
} from './fetchTasks';
import { supabase } from '@/lib/supabase';

export const deleteTask = async (taskId: number) => {
  const { error } = await supabase.from('tasks').delete().eq('id', taskId);
  if (error) throw error;
};

type UseDeleteTaskParams = {
  mutationConfig?: Omit<
    MutationConfig<typeof deleteTask>,
    'mutationFn' | 'onMutate' | 'onError' | 'onSettled'
  >;
};

type DeleteTaskContext = {
  previousTasks?: [TasksQueryKey, TasksQueryResult | undefined][];
};

export const useDeleteTask = ({ mutationConfig }: UseDeleteTaskParams = {}) => {
  return useMutation<void, Error, number, DeleteTaskContext>({
    mutationFn: deleteTask,
    onMutate: async (taskId, context) => {
      await context.client.cancelQueries({ queryKey: fetchTasksQueryKeys.all });

      const previousTasks = context.client.getQueriesData<TasksQueryResult>({
        queryKey: fetchTasksQueryKeys.all,
      }) as [TasksQueryKey, TasksQueryResult | undefined][];

      previousTasks.forEach(([queryKey, oldTasks]) => {
        if (!oldTasks) return;

        const exist = oldTasks.some((task) => task.id === taskId);
        if (!exist) return;

        context.client.setQueryData(
          queryKey,
          oldTasks.filter((task) => task.id !== taskId),
        );
      });

      return { previousTasks };
    },
    onError: (_err, _taskId, onMutateResult, context) => {
      onMutateResult?.previousTasks.forEach(([queryKey, data]) => {
        context.client.setQueryData(queryKey, data);
      });
    },
    onSettled: (_data, _error, _variables, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: fetchTasksQueryKeys.all });
    },
    ...mutationConfig,
  });
};
