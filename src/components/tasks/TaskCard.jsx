import { toast } from 'sonner';
import useUpdateTaskModal from '@/stores/updateTaskModalStore';
import useDeleteTaskModal from '@/stores/deleteTaskModalStore';
import useFilterStore from '@/stores/filterStore';
import { useUpdateTask } from '@/api/updateTask';
import { cn } from '@/lib/utils';
import { useDraggable } from '@dnd-kit/react';
import { usePauseTimer } from './usePauseTimer';
import { useUrgencyCheck } from './useUrgencyCheck';
import TaskTimestamps from './TaskTimestamps';
import TaskActions from './TaskActions';
import { useRole } from '@/hooks/useRole';
import ProfileAvatar from '../shared/ProfileAvatar';

const TaskCard = ({ task, className }) => {
  // Zustand store selectors
  const setIsUpdateTaskModalOpen = useUpdateTaskModal(
    (state) => state.setIsModalOpen,
  );
  const setIsDeleteTaskModalOpen = useDeleteTaskModal(
    (state) => state.setIsModalOpen,
  );
  const setSelectedTaskId = useFilterStore((state) => state.setSelectedTaskId);

  const { isOwner } = useRole();
  const canModify = isOwner(task.user_id);

  // Mutation
  const { mutate: updateTaskMutate } = useUpdateTask({
    mutationConfig: {
      onError: (err) => {
        toast.error('Task gagal diperbarui', {
          description: err.response?.data?.message || null,
        });
      },
    },
  });

  // Custom hooks
  const { isPaused, totalPause, togglePause } = usePauseTimer({
    task,
    updateTaskMutate,
  });

  // Drag and drop
  const { ref: draggableRef, isDragSource } = useDraggable({
    id: task.id,
    data: task,
    disabled: !!task.optimistic || isPaused || !canModify,
  });

  const { isUrgent, diffInMinutes } = useUrgencyCheck({
    status: task.status,
    scheduled_at: task.scheduled_at,
    optimistic: !!task.optimistic,
  });

  // Event handlers
  const handleUpdateTaskModal = () => {
    setIsUpdateTaskModalOpen(true);
    setSelectedTaskId(task.id);
  };

  const handleDeleteTaskModal = () => {
    setIsDeleteTaskModalOpen(true);
    setSelectedTaskId(task.id);
  };

  return (
    <div
      ref={draggableRef}
      className={cn(
        'flex flex-col gap-2 rounded-lg border p-3 shadow-sm select-none transition duration-300 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 cursor-default',
        {
          'hover:shadow-md hover:-translate-y-1 cursor-grab':
            canModify && !isPaused,
          'bg-todo-card border-todo-border shadow-todo-border/50':
            task.status === 'todo',
          'bg-progress-card border-progress-border shadow-progress-border/50':
            task.status === 'on progress',
          'bg-done-card border-done-border shadow-done-border/50':
            task.status === 'done',
          'animate-pulse pointer-events-none': !!task.optimistic,
          'cursor-not-allowed': !canModify,
          'opacity-40': isDragSource,
        },
        className,
      )}
    >
      {/* Header: Title */}
      <h3 className="text-base font-bold leading-tight text-card-foreground line-clamp-2">
        {task.content}
      </h3>

      {/* Body: Description */}
      {task.detail && (
        <p className="text-sm leading-snug line-clamp-2">{task.detail}</p>
      )}

      {/* Assignee & Metadata */}
      <div className="flex flex-col gap-2 mt-1">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center text-xs text-muted-foreground">
            <ProfileAvatar profile={task.profile} size="sm" />
            <span className="font-medium text-foreground">
              {task.profile.name || '-'}
            </span>
          </div>
          {task.assigner && (
            <span className="text-[10px] text-muted-foreground/70">
              oleh {task.assigner.name}
            </span>
          )}
        </div>

        <TaskTimestamps
          status={task.status}
          timestamp_todo={task.timestamp_todo}
          timestamp_progress={task.timestamp_progress}
          timestamp_done={task.timestamp_done}
          pause_time={task.pause_time}
          scheduled_at={task.scheduled_at}
          isPaused={isPaused}
          isUrgent={isUrgent}
          diffInMinutes={diffInMinutes}
        />
      </div>

      {/* Footer: Controls */}
      <TaskActions
        status={task.status}
        optimistic={!!task.optimistic}
        isPaused={isPaused}
        totalPause={totalPause}
        minute_activity={task.minute_activity}
        togglePause={togglePause}
        onEdit={handleUpdateTaskModal}
        onDelete={handleDeleteTaskModal}
        canModify={canModify}
      />
    </div>
  );
};

export default TaskCard;
