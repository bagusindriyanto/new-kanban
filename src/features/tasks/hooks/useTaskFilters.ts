import { useFilterStore, type SelectedUserId } from '@/stores/filterStore';
import { endOfDay, startOfDay } from 'date-fns';

export type QueryParams = {
  user_id?: SelectedUserId;
  from_date?: string;
  to_date?: string;
};

const useTaskFilters = () => {
  const range = useFilterStore((state) => state.range);
  const selectedUserId = useFilterStore((state) => state.selectedUserId);
  const setSelectedUserId = useFilterStore((state) => state.setSelectedUserId);

  const queryParams: QueryParams = {
    user_id: selectedUserId,
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
