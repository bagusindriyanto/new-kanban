import { useMutation } from '@tanstack/react-query';
import { type MutationConfig } from '@/lib/queryClient';
import {
  fetchTasksQueryKeys,
  type OptimisticTaskQueryResult,
  type TasksQueryKey,
  type TasksQueryResult,
} from './fetchTasks';
import {
  fetchUsersQueryKey,
  type UsersQueryResult,
} from '@/features/users/api/fetchUsers';
import { supabase } from '@/lib/supabase';
import type { AddTaskSubmitInput } from '../schemas/addTaskSchema';

export const addTask = async (data: AddTaskSubmitInput) => {
  const { error } = await supabase.from('tasks').insert(data);
  if (error) throw error;
};

type UseAddTaskParams = {
  mutationConfig?: Omit<
    MutationConfig<typeof addTask>,
    'mutationFn' | 'onMutate' | 'onError' | 'onSettled'
  >;
};

type AddTaskContext = {
  previousTasks?: [TasksQueryKey, TasksQueryResult | undefined][];
};

export const useAddTask = ({ mutationConfig }: UseAddTaskParams = {}) => {
  return useMutation<void, Error, AddTaskSubmitInput, AddTaskContext>({
    mutationFn: addTask,
    onMutate: async (newTask, context) => {
      await context.client.cancelQueries({ queryKey: fetchTasksQueryKeys.all });

      const previousTasks = context.client.getQueriesData<TasksQueryResult>({
        queryKey: fetchTasksQueryKeys.all,
      }) as [TasksQueryKey, TasksQueryResult | undefined][];

      const profiles =
        context.client.getQueryData<UsersQueryResult>(fetchUsersQueryKey());
      const newUser =
        profiles?.find((profile) => profile.user_id === newTask.user_id) ??
        null;
      const newAssigner =
        profiles?.find((profile) => profile.user_id === newTask.assigner_id) ??
        null;

      previousTasks.forEach(([queryKey, oldTasks]) => {
        if (!oldTasks) return;

        const filters = queryKey[1];
        if (!filters) return;

        const matchedFilter =
          !filters?.user_id ||
          filters.user_id === 'all' ||
          filters.user_id === newTask.user_id;

        if (!matchedFilter) return;

        const optimisticTask: OptimisticTaskQueryResult = {
          ...newTask,
          id: Date.now(),
          detail: newTask.detail ?? null,
          timestamp_progress: newTask.timestamp_progress ?? null,
          timestamp_done: newTask.timestamp_done ?? null,
          scheduled_at: newTask.scheduled_at ?? null,
          pause_time: newTask.pause_time ?? null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          assigner_id: newTask.assigner_id ?? null,
          user: newUser,
          assigner: newAssigner ? { name: newAssigner.name } : null,
          optimistic: true,
        };

        context.client.setQueryData(queryKey, [optimisticTask, ...oldTasks]);
      });
      return { previousTasks };
    },
    onError: (_err, _newTask, onMutateResult, context) => {
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
