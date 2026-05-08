import { queryClient } from '@/lib/react-query';

export const refreshData = () => {
  queryClient.invalidateQueries();
};
