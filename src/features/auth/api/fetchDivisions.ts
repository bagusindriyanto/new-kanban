import { queryOptions, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { QueryConfig } from '@/lib/queryClient';

export const fetchDivisions = async () => {
  const { data, error } = await supabase.from('divisions').select('id, name');
  if (error) throw error;
  return data;
};

export const fetchDivisionsQueryKey = () => ['divisions'];

const fetchDivisionsQueryOptions = () => {
  return queryOptions({
    queryKey: fetchDivisionsQueryKey(),
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
