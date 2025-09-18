import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '@/api/tasks';

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      // invalidate query tasks biar refetch data baru
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
