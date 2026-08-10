import { queryOptions, useQuery } from '@tanstack/react-query';
import type { QueryConfig } from '@/lib/queryClient';
import { divisionsQuery } from './query';
import { divisionKeys } from './queryKeys';

export const fetchDivisions = async () => {
  const { data, error } = await divisionsQuery();
  if (error) throw error;
  return data;
};

const fetchDivisionsQueryOptions = () => {
  return queryOptions({
    queryKey: divisionKeys.all,
    queryFn: fetchDivisions,
  });
};

type UseFetchDivisionsParams = {
  queryConfig?: QueryConfig<typeof fetchDivisionsQueryOptions>;
};

export const useFetchDivisions = ({
  queryConfig,
}: UseFetchDivisionsParams = {}) => {
  return useQuery({
    ...fetchDivisionsQueryOptions(),
    ...queryConfig,
  });
};
