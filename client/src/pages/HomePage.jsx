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
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import useTaskFilters from '@/hooks/useTaskFilters';

// Drag and drop
import { DragDropProvider } from '@dnd-kit/react';
import { useUpdateTask } from '@/api/updateTask';
import { computeStatusTransition } from '@/utils/statusTransition';
import { toast } from 'sonner';
import { DragOverlay } from '@dnd-kit/react';
import TaskCard from '@/components/tasks/TaskCard';
import BoardStatsColumn from '@/components/dashboard/BoardStatsColumn';

const HomePage = () => {
  // Gunakan custom hook untuk logic filter
  const { queryParams } = useTaskFilters();

  // Tanstack query untuk tasks
  const {
    data: tasks,
    isLoading: isFetchTasksLoading,
    error: fetchTasksError,
    dataUpdatedAt,
  } = useFetchTasks(queryParams);

  // Mutation untuk drag and drop
  const { mutate: updateTaskMutate } = useUpdateTask({
    mutationConfig: {
      onError: (err) => {
        toast.error(
          err.response?.data?.message ||
            err.message ||
            'Gagal memperbarui task.',
          {
            description: err.response?.data?.error_detail || null,
          },
        );
      },
    },
  });

  // Handle drag end untuk update status
  const handleDragEnd = (event) => {
    if (event.canceled) return;

    const { source, target } = event.operation;

    if (!source || !target) return;

    // target.id = column status id (e.g. "todo", "on progress")
    const newStatus = target.id;
    const task = source.data?.task;

    if (!task) return;

    // Jangan update jika drop di kolom yang sama
    if (task.status === newStatus) return;

    const data = computeStatusTransition(task, newStatus);
    if (!data) return;

    updateTaskMutate(data);
  };

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
  const isOnline = useOnlineStatus();

  return (
    <section className="flex-1 relative">
      <div className="absolute inset-0 flex flex-col">
        {/* Tasks Controls */}
        <div className="flex justify-between px-4 pt-4">
          <h2 className="ml-1 text-2xl font-bold tracking-tight">Tasks</h2>
          <TasksControls dataUpdatedAt={dataUpdatedAt} />
        </div>
        <div className="flex flex-col flex-1 min-h-0 p-4">
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
            isOnline && <EmptyState />}
          {tasks?.length > 0 && !isFetchTasksLoading && (
            <DragDropProvider onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-4 gap-3 flex-1 min-h-0">
                {columns.map((column) => (
                  <StatusColumn
                    key={column.id}
                    columnId={column.id}
                    title={column.title}
                    tasks={tasks?.filter((task) => task.status === column.id)}
                  />
                ))}
                <BoardStatsColumn tasks={tasks || []} />
              </div>
              <DragOverlay>
                {(source) => {
                  const task = source.data?.task;
                  if (!task) return null;
                  return (
                    <TaskCard
                      task={task}
                      className="opacity-100 scale-105 rotate-1"
                    />
                  );
                }}
              </DragOverlay>
            </DragDropProvider>
          )}
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
