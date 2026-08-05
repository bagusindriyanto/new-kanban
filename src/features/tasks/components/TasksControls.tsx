import { RefreshToggle } from '@/components/shared/RefreshToggle';
import { FilterCalendar } from '@/components/shared/filter/FilterCalendar';
import FilterUsers from '@/features/users/components/FilterUsers';
import AddTaskModal from './form/AddTaskModal';

const TasksControls = ({ dataUpdatedAt }: { dataUpdatedAt: number }) => {
  return (
    <div className="flex justify-end gap-2 items-center">
      <RefreshToggle dataUpdatedAt={dataUpdatedAt} />
      <FilterUsers />
      <FilterCalendar />
      <AddTaskModal />
    </div>
  );
};

export default TasksControls;
