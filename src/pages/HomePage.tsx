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
    <section
      data-content-padding="false"
      className="flex h-[calc(100dvh-var(--dashboard-header-height))] min-h-0 min-w-0 flex-col overflow-hidden px-4"
    >
      {/* <div className="absolute inset-0 flex flex-col"> */}
      {/* Tasks Controls */}
      <div className="flex shrink-0 flex-col gap-3 md:flex-row md:justify-between py-4">
        <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
        <TasksControls dataUpdatedAt={dataUpdatedAt} />
      </div>
      {tasks && !isOnline ? (
        <OfflineBanner />
      ) : tasks && error ? (
        <ErrorBanner errorMessage={error.message} className="mb-4" />
      ) : null}
      {/* Tasks Contents */}
      {/* <div className="min-h-0 min-w-0 flex-1 overflow-x-auto overflow-y-hidden"> */}
      <TasksContents
        isOnline={isOnline}
        isLoading={isLoading}
        error={error}
        tasks={tasks}
      />
      {/* </div> */}
      {/* Modal untuk update task */}
      <UpdateTaskModal />
      {/* Modal untuk hapus task */}
      <DeleteTaskModal />
      {/* </div> */}
    </section>
  );
};

export default HomePage;
