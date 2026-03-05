import { RefreshToggle } from '@/components/layout/RefreshToggle';
import { FilterCalendar } from '@/components/shared/filter/FilterCalendar';
import FilterPICs from '@/components/shared/filter/FilterPICs';
import AddItemsDropdown from './AddItemsDropdown';
import { Filter } from 'lucide-react';

const TasksControls = ({ isFetching, dataUpdatedAt }) => {
  return (
    <div className="flex justify-end gap-2 items-center">
      <RefreshToggle isFetching={isFetching} dataUpdatedAt={dataUpdatedAt} />
      <FilterPICs />
      <FilterCalendar />
      <AddItemsDropdown />
    </div>
  );
};

export default TasksControls;
