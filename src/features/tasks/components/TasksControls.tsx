import { RefreshToggle } from '@/components/shared/RefreshToggle';
import { FilterCalendar } from '@/components/shared/filter/FilterCalendar';
import FilterUsers from '@/features/users/components/FilterUsers';
import AddTaskModal from './form/AddTaskModal';

const TasksControls = ({ dataUpdatedAt }: { dataUpdatedAt: number }) => {
  return (
    <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center 2xl:justify-end">
      <RefreshToggle dataUpdatedAt={dataUpdatedAt} />
      <FilterUsers />
      <FilterCalendar title="Filter Tasks yang Selesai" />
      <AddTaskModal />
    </div>
  );
};

export default TasksControls;
