import { QueryClient, type UseMutationOptions } from '@tanstack/react-query';
import { fetchUpcomingTasksQueryKey } from '@/features/tasks/api/fetchUpcomingTasks';
import { fetchDashboardQueryKeys } from '@/features/dashboard/api/fetchDashboard';

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
          queryKey: fetchDashboardQueryKeys.all,
        });
        // Invalidate data upcoming tasks
        queryClient.invalidateQueries({
          queryKey: fetchUpcomingTasksQueryKey(),
        });
      },
    },
  },
});

export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
  Awaited<ReturnType<FnType>>;

export type QueryConfig<T extends (...args: any[]) => any> = Omit<
  ReturnType<T>,
  'queryKey' | 'queryFn'
>;

export type MutationConfig<
  MutationFnType extends (...args: any) => Promise<any>,
> = UseMutationOptions<
  ApiFnReturnType<MutationFnType>,
  Error,
  Parameters<MutationFnType>[0]
>;
