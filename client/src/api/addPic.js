import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { queryClient } from '@/lib/react-query';
import { fetchPICsQueryKey } from './fetchPICs';

export const addPIC = async (name) => {
  const response = await api.post('/pics.php', { name });
  return response.data;
};

export const useAddPIC = (params = {}) => {
  return useMutation({
    mutationFn: addPIC,
    ...params.mutationConfig,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: fetchPICsQueryKey() });
      params.mutationConfig?.onSuccess?.(
        data,
        variables,
        onMutateResult,
        context
      );
    },
  });
};
