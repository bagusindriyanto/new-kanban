import { queryOptions, useQuery } from '@tanstack/react-query';
import type { QueryConfig } from '@/lib/queryClient';
import { currentUserQuery } from './query';
import { userKeys } from './queryKeys';
import useAuthStore from '@/stores/authStore';

export const fetchCurrentUser = async (userId: string) => {
  const { data, error } = await currentUserQuery(userId);
  if (error) throw error;
  return data;
};

const fetchCurrentUserQueryOptions = (userId: string) => {
  return queryOptions({
    queryKey: userKeys.currentUser(userId),
    queryFn: () => fetchCurrentUser(userId),
    enabled: !!userId,
    staleTime: Infinity,
  });
};

type UseFetchCurrentUserParams = {
  queryConfig?: QueryConfig<typeof fetchCurrentUserQueryOptions>;
};

export const useFetchCurrentUser = ({
  queryConfig,
}: UseFetchCurrentUserParams = {}) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const userId = currentUser?.id;

  return useQuery({
    ...fetchCurrentUserQueryOptions(userId!),
    ...queryConfig,
  });
};
