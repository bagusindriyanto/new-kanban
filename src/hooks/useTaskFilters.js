import useFilterStore from '@/stores/filterStore';
import { endOfDay, startOfDay } from 'date-fns';

const useTaskFilters = () => {
  const range = useFilterStore((state) => state.range);
  const selectedUserId = useFilterStore((state) => state.selectedUserId);
  const setSelectedUserId = useFilterStore((state) => state.setSelectedUserId);

  const queryParams = {
    user_id: selectedUserId === 'all' ? undefined : selectedUserId,
    from_date: range?.from ? startOfDay(range.from).toISOString() : undefined,
    to_date: range?.to
      ? endOfDay(range.to).toISOString()
      : range?.from
        ? endOfDay(range.from).toISOString()
        : undefined,
  };

  return {
    range,
    selectedUserId,
    setSelectedUserId,
    queryParams,
  };
};

export default useTaskFilters;
