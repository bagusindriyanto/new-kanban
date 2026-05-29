import { RefreshToggle } from '@/components/layout/RefreshToggle';
import { FilterCalendar } from '@/components/shared/filter/FilterCalendar';
import FilterProfiles from '@/components/shared/filter/FilterProfiles';
import AddTaskModal from '../tasks/AddTaskModal';

const TasksControls = ({ dataUpdatedAt }) => {
  return (
    <div className="flex justify-end gap-2 items-center">
      <RefreshToggle dataUpdatedAt={dataUpdatedAt} />
      <FilterProfiles />
      <FilterCalendar />
      <AddTaskModal />
    </div>
  );
};

export default TasksControls;
