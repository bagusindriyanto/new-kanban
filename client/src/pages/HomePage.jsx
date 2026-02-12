import { Toaster } from '@/components/ui/sonner';
import StatusColumn from '@/components/StatusColumn';
import UpdateTaskModal from '@/components/UpdateTaskModal';
import DeleteTaskModal from '@/components/DeleteTaskModal';

// Setting Kolom
import { columns } from '@/config/column';

// Komponen Filter
import { Spinner } from '@/components/ui/spinner';
import useFilter from '@/stores/filterStore';
import HeaderControls from '@/components/HeaderControls';
import useFilteredTasks from '@/hooks/useFilteredTasks';
import { useFetchTasks } from '@/api/fetchTasks';
import { useFetchPICs } from '@/api/fetchPICs';
import { ErrorBanner, ErrorFull } from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import Footer from '@/components/Footer';
import { useIsOnline } from '@/hooks/useIsOnline';
import AddTaskModal from '@/components/AddTaskModal';
import useDeadlineChecker from '@/hooks/useDeadlineChecker';
import useNotification from '@/stores/notificationStore';
import UpcomingTasksPanel from '@/components/UpcomingTasksPanel';
import { useEffect } from 'react';

const HomePage = () => {
  // State untuk filter tanggal
  const range = useFilter((state) => state.range);

  // Tanstack query untuk tasks
  const {
    data: tasks,
    isLoading: isFetchTasksLoading,
    error: fetchTasksError,
    isFetching,
    dataUpdatedAt,
  } = useFetchTasks();
  // Tanstack query untuk pics
  const {
    data: pics,
    isLoading: isFetchPICsLoading,
    error: fetchPICsError,
  } = useFetchPICs();

  const selectedPicId = useFilter((state) => state.selectedPicId);
  const setSelectedPicId = useFilter((state) => state.setSelectedPicId);

  const sortedTasks = useFilteredTasks(tasks, selectedPicId, range);

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
  if (fetchPICsError) {
    console.log('Error Fetch PIC:');
    console.error(
      fetchPICsError?.response?.data?.error_detail ||
        'Gagal terhubung ke server.',
    );
  }

  // Cek status online/offline
  const isOnline = useIsOnline();

  // Update current time setiap menit
  useEffect(() => {
    const interval = setInterval(updateCurrentTime, 60000);
    return () => clearInterval(interval);
  }, [updateCurrentTime]);

  // Cek deadline tasks
  useDeadlineChecker(sortedTasks);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between bg-nav h-[52px] px-5 py-3">
        <h1 className="text-3xl font-semibold text-white">Kanban App</h1>
        <HeaderControls
          pics={pics}
          tasks={sortedTasks}
          selectedPicId={selectedPicId}
          setSelectedPicId={setSelectedPicId}
          isFetching={isFetching}
          dataUpdatedAt={dataUpdatedAt}
          currentTime={currentTime}
        />
      </header>
      {/* Main */}
      <main className="flex flex-1 flex-col p-3 gap-3">
        {isOnline &&
          (isFetchTasksLoading || isFetchPICsLoading) &&
          !fetchTasksError &&
          !fetchPICsError && (
            <div className="flex flex-1 justify-center items-center">
              <Spinner className="size-10" />
            </div>
          )}
        {sortedTasks.length > 0 &&
          (fetchTasksError || fetchPICsError || !isOnline) && (
            <ErrorBanner
              isOnline={isOnline}
              fetchTasksError={fetchTasksError}
              fetchPICsError={fetchPICsError}
            />
          )}
        {sortedTasks.length === 0 &&
          (fetchTasksError || fetchPICsError || !isOnline) && (
            <ErrorFull
              isOnline={isOnline}
              fetchTasksError={fetchTasksError}
              fetchPICsError={fetchPICsError}
            />
          )}
        {sortedTasks.length === 0 &&
          !isFetchTasksLoading &&
          !fetchTasksError &&
          isOnline && <EmptyState action={<AddTaskModal />} />}
        {sortedTasks.length > 0 && (
          <div className="flex gap-4 flex-1">
            {columns.map((column) => (
              <StatusColumn
                key={column.id}
                title={column.title}
                tasks={sortedTasks.filter((task) => task.status === column.id)}
                currentTime={currentTime}
              />
            ))}
          </div>
        )}
      </main>
      {/* Footer */}
      <Footer />
      {/* Modal untuk update task */}
      <UpdateTaskModal />
      {/* Modal untuk hapus task */}
      <DeleteTaskModal />
      {/* Toast */}
      <Toaster position="top-center" richColors />
    </div>
  );
};

export default HomePage;
