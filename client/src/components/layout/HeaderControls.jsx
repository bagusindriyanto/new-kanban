import { RefreshToggle } from '@/components/layout/RefreshToggle';
import { FilterCalendar } from '@/components/shared/filter/FilterCalendar';
import FilterPICs from '@/components/shared/filter/FilterPICs';
import AddItemsDropdown from '@/components/layout/AddItemsDropdown';
import UpcomingTasksPanel from '../tasks/UpcomingTasksPanel';

const HeaderControls = ({
  tasks = [],
  isFetching,
  dataUpdatedAt,
  currentTime,
}) => {
  return (
    <div className="flex px-3 pt-2 gap-2 justify-end items-center">
      <RefreshToggle isFetching={isFetching} dataUpdatedAt={dataUpdatedAt} />
      <FilterPICs />
      <FilterCalendar />
      <UpcomingTasksPanel tasks={tasks} currentTime={currentTime} />
      <AddItemsDropdown />
    </div>
  );
};

export default HeaderControls;
