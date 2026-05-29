import useFilterStore from '@/stores/filterStore';
import { format } from 'date-fns';

const useTaskFilters = () => {
  const range = useFilterStore((state) => state.range);
  const selectedUserId = useFilterStore((state) => state.selectedUserId);
  const setSelectedUserId = useFilterStore((state) => state.setSelectedUserId);

  const queryParams = {
    user_id: selectedUserId === 'all' ? undefined : selectedUserId,
    from_date: range?.from ? format(range.from, 'yyyy-MM-dd') : undefined,
    to_date: range?.to ? format(range.to, 'yyyy-MM-dd') : undefined,
  };

  return {
    range,
    selectedUserId,
    setSelectedUserId,
    queryParams,
  };
};

export default useTaskFilters;
