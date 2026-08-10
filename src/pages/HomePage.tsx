import UpdateTaskModal from '@/features/tasks/components/form/UpdateTaskModal';
import DeleteTaskModal from '@/features/tasks/components/form/DeleteTaskModal';

// Komponen Filter
import TasksControls from '@/features/tasks/components/TasksControls';
import { useFetchTasks } from '@/features/tasks/api/fetchTasks';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useTaskFilters } from '@/features/tasks/hooks/useTaskFilters';

import TasksContents from '@/features/tasks/components/TasksContents';
import OfflineBanner from '@/components/shared/OfflineBanner';
import ErrorBanner from '@/components/shared/ErrorBanner';

const HomePage = () => {
  // Gunakan custom hook untuk logic filter
  const { taskFilters } = useTaskFilters();

  // Tanstack query untuk tasks
  const {
    data: tasks,
    isLoading,
    error,
    dataUpdatedAt,
  } = useFetchTasks({ filters: taskFilters });

  // Cek status online/offline
  const isOnline = useOnlineStatus();

  return (
    <section className="flex-1 relative">
      <div className="absolute inset-0 flex flex-col">
        {/* Tasks Controls */}
        <div className="flex justify-between px-4 pt-4">
          <h2 className="ml-1 text-2xl font-bold tracking-tight">Tasks</h2>
          <TasksControls dataUpdatedAt={dataUpdatedAt} />
        </div>
        {/* Tasks Contents */}
        <div className="flex flex-col flex-1 min-h-0 p-4">
          {tasks && !isOnline ? (
            <OfflineBanner className="mb-4" />
          ) : tasks && error ? (
            <ErrorBanner errorMessage={error.message} className="mb-4" />
          ) : null}
          <TasksContents
            isOnline={isOnline}
            isLoading={isLoading}
            error={error}
            tasks={tasks}
          />
        </div>
        {/* Modal untuk update task */}
        <UpdateTaskModal />
        {/* Modal untuk hapus task */}
        <DeleteTaskModal />
      </div>
    </section>
  );
};

export default HomePage;
