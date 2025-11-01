import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { queryClient } from '@/lib/react-query';
import { fetchPicsQueryKey } from './fetchPics';

export const addPic = async (name) => {
  const response = await api.post('/pics.php', { name });
  return response.data;
};

export const useAddPic = (params = {}) => {
  return useMutation({
    mutationFn: addPic,
    ...params.mutationConfig,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: fetchPicsQueryKey() });
      params.mutationConfig?.onSuccess?.(
        data,
        variables,
        onMutateResult,
        context
      );
    },
  });
};
