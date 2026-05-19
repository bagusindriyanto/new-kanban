import useFilter from '@/stores/filterStore';
import { format } from 'date-fns';

const useTaskFilters = () => {
  const range = useFilter((state) => state.range);
  const selectedPicId = useFilter((state) => state.selectedPicId);
  const setSelectedPicId = useFilter((state) => state.setSelectedPicId);

  const queryParams = {
    pic_id: selectedPicId === 'all' ? undefined : selectedPicId,
    from_date: range?.from ? format(range.from, 'yyyy-MM-dd') : undefined,
    to_date: range?.to ? format(range.to, 'yyyy-MM-dd') : undefined,
  };

  return {
    range,
    selectedPicId,
    setSelectedPicId,
    queryParams,
  };
};

export default useTaskFilters;
