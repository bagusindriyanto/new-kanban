import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { queryClient } from '@/lib/queryClient';
import { fetchTasksQueryKey } from './fetchTasks';
import { fetchUsersQueryKey } from '@/features/users/api/fetchUsers';

export const addTask = async (data) => {
  const response = await api.post('/tasks', data);
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

      const profiles = queryClient.getQueryData(fetchUsersQueryKey());
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
          Number(filters.user_id) === Number(newTask.user_id);

        if (!matchedFilter) return;

        queryClient.setQueryData(queryKey, [
          {
            ...newTask,
            id: `temp-${Date.now()}`,
            user: {
              id: newTask.user_id,
              profile: newUser,
            },
            assigner: newAssigner
              ? {
                  id: newTask.assigner_id,
                  profile: newAssigner,
                }
              : null,
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
