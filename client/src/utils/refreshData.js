import { queryClient } from '@/lib/queryClient';

export const refreshData = () => {
  queryClient.invalidateQueries();
};
