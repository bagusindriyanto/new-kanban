import StatusColumn from '@/components/dashboard/StatusColumn';
import UpdateTaskModal from '@/components/tasks/UpdateTaskModal';
import DeleteTaskModal from '@/components/tasks/DeleteTaskModal';

// Setting Kolom
import { columns } from '@/config/column';

// Komponen Filter
import { Spinner } from '@/components/ui/spinner';
import TasksControls from '@/components/layout/TasksControls';
import { useFetchTasks } from '@/api/fetchTasks';
import { ErrorBanner, ErrorFull } from '@/components/shared/ErrorState';
import EmptyState from '@/components/shared/EmptyState';
import { useIsOnline } from '@/hooks/useIsOnline';
import useTaskFilters from '@/hooks/useTaskFilters';
import SiteHeader from '@/components/layout/SiteHeader';
import AddTaskModal from '@/components/tasks/AddTaskModal';

const HomePage = () => {
  // Gunakan custom hook untuk logic filter
  const { queryParams } = useTaskFilters();

  // Tanstack query untuk tasks
  const {
    data: tasks,
    isLoading: isFetchTasksLoading,
    error: fetchTasksError,
    isFetching,
    dataUpdatedAt,
  } = useFetchTasks(queryParams);

  // Error log
  if (fetchTasksError) {
    console.error(
      fetchTasksError?.response?.data?.error_detail ||
        'Gagal terhubung ke server.',
    );
  }

  // Ambil pesan error
  const errorMessage = fetchTasksError?.response?.data?.message || null;

  // Cek status online/offline
  const isOnline = useIsOnline();

  return (
    <div className="h-screen flex flex-col">
      <SiteHeader titlePage="Kanban Board" />
      {/* Tasks Controls */}
      <div className="flex justify-between px-4 pt-4 pb-1">
        <h2 className="text-2xl ml-1 font-bold tracking-tight">Tasks</h2>
        <TasksControls isFetching={isFetching} dataUpdatedAt={dataUpdatedAt} />
      </div>
      <main className="flex flex-1 flex-col p-4 gap-3">
        {/* Main */}
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
          <div className="flex gap-3 flex-1">
            {columns.map((column) => (
              <StatusColumn
                key={column.id}
                title={column.title}
                tasks={tasks?.filter((task) => task.status === column.id)}
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
