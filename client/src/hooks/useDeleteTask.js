import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTask } from '@/api/tasks';

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      // invalidate query tasks biar refetch data baru
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
