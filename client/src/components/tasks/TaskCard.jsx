import { toast } from 'sonner';
import useUpdateTaskModal from '@/stores/updateTaskModalStore';
import useDeleteTaskModal from '@/stores/deleteTaskModalStore';
import useFilter from '@/stores/filterStore';
import { useUpdateTask } from '@/api/updateTask';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';
import { useDraggable } from '@dnd-kit/react';
import { usePauseTimer } from './usePauseTimer';
import { useUrgencyCheck } from './useUrgencyCheck';
import TaskTimestamps from './TaskTimestamps';
import TaskActions from './TaskActions';

const TaskCard = ({ task, className }) => {
  const {
    id,
    status,
    content,
    detail,
    timestamp_todo,
    timestamp_progress,
    timestamp_pending,
    timestamp_done,
    minute_activity,
    pause_time,
    optimistic = false,
    scheduled_at,
    pic_name,
    assigner_name,
  } = task;

  // Zustand store selectors
  const setIsUpdateTaskModalOpen = useUpdateTaskModal(
    (state) => state.setIsModalOpen,
  );
  const setIsDeleteTaskModalOpen = useDeleteTaskModal(
    (state) => state.setIsModalOpen,
  );
  const setSelectedTaskId = useFilter((state) => state.setSelectedTaskId);

  // Mutation
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

  // Drag and drop
  const { ref: draggableRef, isDragSource } = useDraggable({
    id: id,
    data: { task },
    disabled: optimistic || !!pause_time,
  });

  // Custom hooks
  const { isPaused, totalPause, togglePause } = usePauseTimer({
    task,
    updateTaskMutate,
  });

  const { isUrgent, diffInMinutes } = useUrgencyCheck({
    status,
    scheduled_at,
    optimistic,
  });

  // Event handlers
  const handleUpdateTaskModal = () => {
    setIsUpdateTaskModalOpen(true);
    setSelectedTaskId(id);
  };

  const handleDeleteTaskModal = () => {
    setIsDeleteTaskModalOpen(true);
    setSelectedTaskId(id);
  };

  return (
    <div
      ref={draggableRef}
      className={cn(
        'flex flex-col gap-2 rounded-lg border p-3 shadow-sm transition-shadow hover:shadow-md select-none cursor-grab',
        {
          'bg-todo-card border-todo-border': status === 'todo',
          'bg-progress-card border-progress-border': status === 'on progress',
          'bg-pending-card border-pending-border': status === 'pending',
          'bg-done-card border-done-border': status === 'done',
          'animate-pulse pointer-events-none': optimistic,
          'opacity-40': isDragSource,
        },
        className,
      )}
    >
      {/* Header: Title */}
      <h3 className="text-base font-bold leading-tight text-card-foreground line-clamp-2">
        {content}
      </h3>

      {/* Body: Description */}
      {detail && <p className="text-sm leading-snug line-clamp-2">{detail}</p>}

      {/* Assignee & Metadata */}
      <div className="flex flex-col gap-2 mt-1">
        <div className="flex justify-between items-center">
          <div className="flex gap-1 items-center text-xs text-muted-foreground">
            <User className="size-3.5" />
            <span className="font-medium text-foreground">
              {pic_name || '-'}
            </span>
          </div>
          {assigner_name && (
            <span className="text-[10px] text-muted-foreground/70">
              oleh {assigner_name}
            </span>
          )}
        </div>

        <TaskTimestamps
          status={status}
          timestamp_todo={timestamp_todo}
          timestamp_progress={timestamp_progress}
          timestamp_pending={timestamp_pending}
          timestamp_done={timestamp_done}
          pause_time={pause_time}
          scheduled_at={scheduled_at}
          isPaused={isPaused}
          isUrgent={isUrgent}
          diffInMinutes={diffInMinutes}
        />
      </div>

      {/* Footer: Controls */}
      <TaskActions
        status={status}
        optimistic={optimistic}
        isPaused={isPaused}
        totalPause={totalPause}
        minute_activity={minute_activity}
        togglePause={togglePause}
        onEdit={handleUpdateTaskModal}
        onDelete={handleDeleteTaskModal}
      />
    </div>
  );
};

export default TaskCard;
