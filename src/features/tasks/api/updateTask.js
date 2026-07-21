import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { fetchTasksQueryKey } from './fetchTasks';
import { fetchUsersQueryKey } from '@/features/users/api/fetchUsers';
import { supabase } from '@/lib/supabase';

export const updateTask = async (data) => {
  const { id, user: _, assigner: __, ...updatedData } = data;
  const { error } = await supabase
    .from('tasks')
    .update(updatedData)
    .eq('id', id);
  if (error) throw error;
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

      const profiles = queryClient.getQueryData(fetchUsersQueryKey());
      const updatedUser =
        profiles?.find((profile) => profile.user_id === updatedTask.user_id) ??
        null;
      const updatedAssigner =
        profiles?.find(
          (profile) => profile.user_id === updatedTask.assigner_id,
        ) ?? null;

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
                    user: {
                      ...updatedUser,
                      id: updatedTask.user_id,
                    },
                    assigner: updatedAssigner
                      ? {
                          ...updatedAssigner,
                          id: updatedTask.assigner_id,
                        }
                      : null,
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
