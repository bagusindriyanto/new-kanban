import { QueryClient, type UseMutationOptions } from '@tanstack/react-query';
import { upcomingTaskKeys } from '@/features/upcoming-tasks/api/queryKeys';
import { dashboardKeys } from '@/features/dashboard/api/queryKeys';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Kapan perlu refresh data
      staleTime: 60 * 1000, // 1 minutes
      // Seberapa lama data di-cache
      gcTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      onSuccess: () => {
        // Invalidate data dashboard
        queryClient.invalidateQueries({
          queryKey: dashboardKeys.all,
        });
        // Invalidate data upcoming tasks
        queryClient.invalidateQueries({
          queryKey: upcomingTaskKeys.all,
        });
      },
    },
  },
});

export type ApiFnReturnType<FnType extends (...args: never[]) => Promise<unknown>> =
  Awaited<ReturnType<FnType>>;

export type QueryConfig<T extends (...args: never[]) => unknown> = Omit<
  ReturnType<T>,
  'queryKey' | 'queryFn'
>;

export type MutationConfig<
  MutationFnType extends (...args: never[]) => Promise<unknown>,
> = UseMutationOptions<
  ApiFnReturnType<MutationFnType>,
  Error,
  Parameters<MutationFnType>[0]
>;
