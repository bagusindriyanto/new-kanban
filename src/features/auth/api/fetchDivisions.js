import { queryOptions, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

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

export const useFetchDivisions = (params = {}) => {
  return useQuery({
    ...fetchDivisionsQueryOptions(),
    ...params.queryConfig,
  });
};
