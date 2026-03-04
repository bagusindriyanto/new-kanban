import StatusColumn from '@/components/dashboard/StatusColumn';
import UpdateTaskModal from '@/components/tasks/UpdateTaskModal';
import DeleteTaskModal from '@/components/tasks/DeleteTaskModal';

// Setting Kolom
import { columns } from '@/config/column';

// Komponen Filter
import { Spinner } from '@/components/ui/spinner';
import HeaderControls from '@/components/layout/HeaderControls';
import { useFetchTasks } from '@/api/fetchTasks';
import { ErrorBanner, ErrorFull } from '@/components/shared/ErrorState';
import EmptyState from '@/components/shared/EmptyState';
import Footer from '@/components/layout/Footer';
import { useIsOnline } from '@/hooks/useIsOnline';
import AddTaskModal from '@/components/tasks/AddTaskModal';
import useDeadlineChecker from '@/hooks/useDeadlineChecker';
import useNotification from '@/stores/notificationStore';
import { useEffect } from 'react';

import useTaskFilters from '@/hooks/useTaskFilters';

const HomePage = () => {
  // Gunakan custom hook untuk logic filter
  const { selectedPicId, setSelectedPicId, queryParams } = useTaskFilters();

  // Tanstack query untuk tasks
  const {
    data: tasks,
    isLoading: isFetchTasksLoading,
    error: fetchTasksError,
    isFetching,
    dataUpdatedAt,
  } = useFetchTasks(queryParams);

  const currentTime = useNotification((state) => state.currentTime);
  const updateCurrentTime = useNotification((state) => state.updateCurrentTime);

  // Error log
  if (fetchTasksError) {
    console.log('Error Fetch Tasks:');
    console.error(
      fetchTasksError?.response?.data?.error_detail ||
        'Gagal terhubung ke server.',
    );
  }

  // Ambil pesan error
  const errorMessage = fetchTasksError?.response?.data?.message || null;

  // Cek status online/offline
  const isOnline = useIsOnline();

  // Update current time setiap menit
  useEffect(() => {
    const interval = setInterval(updateCurrentTime, 60000);
    return () => clearInterval(interval);
  }, [updateCurrentTime]);

  // Cek deadline tasks
  useDeadlineChecker(tasks);

  return (
    <div className="h-full flex flex-col">
      {/* Header Controls */}
      <HeaderControls
        tasks={tasks}
        selectedPicId={selectedPicId}
        setSelectedPicId={setSelectedPicId}
        isFetching={isFetching}
        dataUpdatedAt={dataUpdatedAt}
        currentTime={currentTime}
      />
      {/* Main */}
      <main className="flex flex-1 flex-col p-3 gap-3">
        {isOnline && isFetchTasksLoading && !fetchTasksError && (
          <div className="flex flex-1 justify-center items-center">
            <Spinner className="size-10" />
          </div>
        )}
        {tasks?.length > 0 && (fetchTasksError || !isOnline) && (
          <ErrorBanner isOnline={isOnline} errorMessage={errorMessage} />
        )}
        {tasks?.length === 0 && (fetchTasksError || !isOnline) && (
          <ErrorFull isOnline={isOnline} errorMessage={errorMessage} />
        )}
        {tasks?.length === 0 &&
          !isFetchTasksLoading &&
          !fetchTasksError &&
          isOnline && <EmptyState action={<AddTaskModal />} />}
        {tasks?.length > 0 && !isFetchTasksLoading && (
          <div className="flex gap-4 flex-1">
            {columns.map((column) => (
              <StatusColumn
                key={column.id}
                title={column.title}
                tasks={tasks?.filter((task) => task.status === column.id)}
                currentTime={currentTime}
              />
            ))}
          </div>
        )}
      </main>
      {/* Modal untuk update task */}
      <UpdateTaskModal />
      {/* Modal untuk hapus task */}
      <DeleteTaskModal />
    </div>
  );
};

export default HomePage;
