import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { fetchSummaryQueryKey } from '@/api/fetchSummary';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Kapan perlu refresh data
      staleTime: 60 * 1000, // 1 minutes
      // Seberapa lama data di-cache
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
        if (
          error instanceof AxiosError &&
          error.status &&
          error.status >= 400 &&
          error.status < 500
        ) {
          return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      onSuccess: () => {
        // Invalidate data summary
        queryClient.invalidateQueries({ queryKey: fetchSummaryQueryKey() });
      },
    },
  },
});
