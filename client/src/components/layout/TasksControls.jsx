import { RefreshToggle } from '@/components/layout/RefreshToggle';
import { FilterCalendar } from '@/components/shared/filter/FilterCalendar';
import FilterPics from '@/components/shared/filter/FilterPics';
import AddTaskModal from '../tasks/AddTaskModal';

const TasksControls = ({ isFetching, dataUpdatedAt }) => {
  return (
    <div className="flex justify-end gap-2 items-center">
      <RefreshToggle isFetching={isFetching} dataUpdatedAt={dataUpdatedAt} />
      <FilterPics />
      <FilterCalendar />
      <AddTaskModal />
    </div>
  );
};

export default TasksControls;
