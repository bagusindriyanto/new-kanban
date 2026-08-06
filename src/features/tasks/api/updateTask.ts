import { useMutation } from '@tanstack/react-query';
import { type MutationConfig } from '@/lib/queryClient';
import {
  fetchUsersQueryKey,
  type UsersQueryResult,
} from '@/features/users/api/fetchUsers';
import { supabase } from '@/lib/supabase';
import {
  fetchTasksQueryKeys,
  type TasksQueryResult,
  type TasksQueryKey,
} from './fetchTasks';
import type { TaskUpdate } from '@/types/task';

export const updateTask = async (data: TaskUpdate) => {
  const { id, ...updatedData } = data;
  const { error } = await supabase
    .from('tasks')
    .update(updatedData)
    .eq('id', id);
  if (error) throw error;
};

type UseUpdateTaskParams = {
  mutationConfig?: Omit<
    MutationConfig<typeof updateTask>,
    'mutationFn' | 'onMutate' | 'onSettled'
  >;
};

type UpdateTaskContext = {
  previousTasks?: [TasksQueryKey, TasksQueryResult | undefined][];
};

export const useUpdateTask = ({
  mutationConfig = {},
}: UseUpdateTaskParams = {}) => {
  const { onError, ...restMutationConfig } = mutationConfig;

  return useMutation<void, Error, TaskUpdate, UpdateTaskContext>({
    mutationFn: updateTask,
    onMutate: async (updatedTask, context) => {
      await context.client.cancelQueries({ queryKey: fetchTasksQueryKeys.all });

      const previousTasks = context.client.getQueriesData<TasksQueryResult>({
        queryKey: fetchTasksQueryKeys.all,
      }) as [TasksQueryKey, TasksQueryResult | undefined][];

      const profiles =
        context.client.getQueryData<UsersQueryResult>(fetchUsersQueryKey());
      const updatedUser =
        profiles?.find((profile) => profile.user_id === updatedTask.user_id) ??
        null;
      const updatedAssigner =
        profiles?.find(
          (profile) => profile.user_id === updatedTask.assigner_id,
        ) ?? null;
      previousTasks.forEach(([queryKey, oldTasks]) => {
        if (!oldTasks) return;

        const filters = queryKey[1];
        const matchedFilter =
          !filters?.user_id ||
          filters.user_id === 'all' ||
          filters.user_id === updatedTask.user_id;

        const exist = oldTasks.some((task) => task.id === updatedTask.id);

        if (!matchedFilter) {
          if (exist) {
            context.client.setQueryData(
              queryKey,
              oldTasks.filter((task) => task.id !== updatedTask.id),
            );
          }
          return;
        }

        context.client.setQueryData(
          queryKey,
          oldTasks
            .map((task) =>
              task.id === updatedTask.id
                ? {
                    ...task,
                    ...updatedTask,
                    updated_at: new Date().toISOString(),
                    user: updatedUser,
                    assigner: updatedAssigner
                      ? { name: updatedAssigner.name }
                      : null,
                    optimistic: true,
                  }
                : task,
            )
            .sort(
              (a, b) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime(),
            ),
        );
      });

      return { previousTasks };
    },
    onError: (err, updatedTask, onMutateResult, context) => {
      onMutateResult?.previousTasks.forEach(([queryKey, data]) => {
        context.client.setQueryData(queryKey, data);
      });

      onError?.(err, updatedTask, onMutateResult, context);
    },
    onSettled: (_data, _error, _variables, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: fetchTasksQueryKeys.all });
    },

    ...restMutationConfig,
  });
};
