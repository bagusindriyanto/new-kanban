import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addTask } from '@/api/tasks';

export const useAddTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTask,
    onSuccess: () => {
      // invalidate query tasks biar refetch data baru
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
