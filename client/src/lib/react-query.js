import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Kapan perlu refresh data
      staleTime: 30 * 1000, // 30 seconds
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
        return failureCount < 3;
      },
    },
  },
});
