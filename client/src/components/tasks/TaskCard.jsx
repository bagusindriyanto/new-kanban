import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatToSQL, parseFromSQL } from '@/utils/formatTimestamp';
import {
  PauseIcon,
  PlayIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/solid';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import useUpdateTaskModal from '@/stores/updateTaskModalStore';
import useDeleteTaskModal from '@/stores/deleteTaskModalStore';
import useFilter from '@/stores/filterStore';
import { memo, useEffect, useRef, useState } from 'react';
import { useUpdateTask } from '@/api/updateTask';
import { cn } from '@/lib/utils';
import { User, Timer, CirclePause } from 'lucide-react';
import { useDraggable } from '@dnd-kit/react';

const TaskCard = ({ task, overlay }) => {
  // Destructure isi props
  const {
    id,
    status,
    content,
    detail,
    timestamp_todo,
    timestamp_progress,
    timestamp_pending,
    timestamp_done,
    minute_pause,
    minute_activity,
    pause_time,
    optimistic = false,
    scheduled_at,
    pic_name,
    assigner_name,
  } = task;

  // State untuk form modal
  const setIsUpdateTaskModalOpen = useUpdateTaskModal(
    (state) => state.setIsModalOpen,
  );

  // State untuk confirm modal
  const setIsDeleteTaskModalOpen = useDeleteTaskModal(
    (state) => state.setIsModalOpen,
  );

  // State untuk pilih task saat ini
  const setSelectedTaskId = useFilter((state) => state.setSelectedTaskId);
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

  // Drag and drop hook
  const { ref: draggableRef, isDragSource } = useDraggable({
    id: id,
    data: { task },
    disabled: optimistic || !!pause_time,
  });

  // Fungsi buka form modal
  const handleUpdateTaskModal = () => {
    setIsUpdateTaskModalOpen(true);
    setSelectedTaskId(id);
  };

  // Fungsi buka confirm modal
  const handleDeleteTaskModal = () => {
    setIsDeleteTaskModalOpen(true);
    setSelectedTaskId(id);
  };

  // State untuk hitung durasi pause
  const [isPaused, setIsPaused] = useState(!!pause_time);
  const [currentPauseMinutes, setCurrentPauseMinutes] = useState(0);
  const pauseStartRef = useRef(null);
  const intervalRef = useRef(null);
  const totalPause = (minute_pause || 0) + (isPaused ? currentPauseMinutes : 0);

  useEffect(() => {
    if (pause_time) {
      setIsPaused(true);
    } else {
      setIsPaused(false);
    }
    if (isPaused) {
      pauseStartRef.current =
        pauseStartRef.current || new Date(pause_time).getTime();
      intervalRef.current = setInterval(() => {
        const diffMs = Date.now() - pauseStartRef.current;
        setCurrentPauseMinutes(Math.floor(diffMs / 60000));
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      pauseStartRef.current = null;
      setCurrentPauseMinutes(0);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPaused, pause_time]);

  const togglePause = () => {
    if (isPaused) {
      // Play: hitung durasi pause berjalan, tambahkan ke minute_pause, reset pause_time di DB
      const pauseEnd = Date.now();
      const pauseDuration = Math.floor(
        (pauseEnd - pauseStartRef.current) / 60000,
      );
      onPauseToggle(pauseDuration, true);
    } else {
      // Pause: set pause_time ke sekarang di DB
      const nowISO = formatToSQL(new Date());
      onPauseToggle(0, false, nowISO);
    }
  };

  // Hitung pause berjalan
  const onPauseToggle = (
    pauseMinutes,
    resetPauseTime = false,
    newPauseTime = null,
  ) => {
    if (!task) return;
    let updatedMinutePause = minute_pause || 0;
    let updatedPauseTime = pause_time;

    if (resetPauseTime) {
      // Tombol Play ditekan: tambahkan durasi pause berjalan ke minute_pause, reset pause_time ke null
      updatedMinutePause += pauseMinutes;
      updatedPauseTime = null;
    } else if (newPauseTime) {
      // Tombol Pause ditekan: set pause_time ke waktu sekarang
      updatedPauseTime = newPauseTime;
    }

    updateTaskMutate({
      ...task,
      minute_pause: updatedMinutePause,
      pause_time: updatedPauseTime,
    });
    setIsPaused(!resetPauseTime);
  };

  // Hitung waktu tersisa dan interval lokal
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    if (status !== 'todo' || !scheduled_at) return;

    const checkUrgency = () => {
      const diffInMinutes = (new Date(scheduled_at) - new Date()) / 60000;
      setIsUrgent(diffInMinutes > 0 && diffInMinutes <= 15 && !optimistic);
    };

    checkUrgency();
    const urgentTimer = setInterval(checkUrgency, 60000); // Cek tiap 1 menit
    return () => clearInterval(urgentTimer);
  }, [status, scheduled_at, optimistic]);

  const diffInMinutesLocal = scheduled_at
    ? (new Date(scheduled_at) - new Date()) / 60000
    : 0;

  return (
    <div
      ref={draggableRef}
      className={cn(
        'flex flex-col gap-2 rounded-lg border p-3 shadow-sm transition-all hover:shadow-md relative overflow-hidden',
        {
          'bg-todo-card border-todo-border': status === 'todo',
          'bg-progress-card border-progress-border': status === 'on progress',
          'bg-pending-card border-pending-border': status === 'pending',
          'bg-done-card border-done-border': status === 'done',
          'animate-pulse pointer-events-none': optimistic,
          'opacity-40': isDragSource && !overlay,
        },
      )}
    >
      {/* 1. HEADER: Title */}
      <h3 className="text-base font-bold leading-tight text-card-foreground line-clamp-2">
        {content}
      </h3>

      {/* 2. BODY: Description */}
      {detail && <p className="text-sm leading-snug line-clamp-2">{detail}</p>}

      {/* 3. ASSIGNEE & METADATA */}
      <div className="flex flex-col gap-2 mt-1">
        {/* Assignee Row */}
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

        {/* Status Context Row (Timestamps & Pause info) */}
        <div className="text-[11px] text-muted-foreground border-t border-border pt-1">
          {status === 'todo' && (
            <div className="flex gap-1 justify-between">
              <p className="font-medium">Dibuat:</p>
              <p className="tabular-nums">{parseFromSQL(timestamp_todo)}</p>
            </div>
          )}

          {status === 'todo' && scheduled_at && (
            <div className="relative mt-1">
              {isUrgent && (
                <span className="absolute -right-1.5 -top-0.5 z-10 flex size-2">
                  <span className="inline-flex absolute w-full h-full bg-red-400 rounded-full opacity-75 animate-ping"></span>
                  <span className="inline-flex relative bg-red-500 rounded-full size-2"></span>
                </span>
              )}
              <div
                className={cn(
                  'flex gap-1 justify-between rounded-md px-1 -mx-1 py-0.5 font-medium border transition-colors',
                  {
                    'border-red-200 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400':
                      isUrgent,
                    'border-muted bg-muted/50 text-muted-foreground opacity-60':
                      diffInMinutesLocal <= 0 && !isUrgent,
                    'border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400':
                      diffInMinutesLocal > 15,
                  },
                )}
              >
                <p className="font-medium">Terjadwal:</p>
                <p className="tabular-nums">{parseFromSQL(scheduled_at)}</p>
              </div>
            </div>
          )}

          {status !== 'todo' && (
            <div className="flex gap-1 justify-between">
              <p className="font-medium">Mulai:</p>
              <p className="tabular-nums">{parseFromSQL(timestamp_progress)}</p>
            </div>
          )}

          {status === 'on progress' && isPaused && (
            <div className="flex gap-1 justify-between">
              <p className="font-medium">Jeda:</p>
              <p className="tabular-nums">{parseFromSQL(pause_time)}</p>
            </div>
          )}

          {status === 'pending' && (
            <div className="flex gap-1 justify-between">
              <p className="font-medium">Pending:</p>
              <p className="tabular-nums">{parseFromSQL(timestamp_pending)}</p>
            </div>
          )}

          {status === 'done' && (
            <div className="flex gap-1 justify-between">
              <p className="font-medium">Selesai:</p>
              <p className="tabular-nums">{parseFromSQL(timestamp_done)}</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. FOOTER: Controls & Schedule */}
      <div className="flex gap-2 justify-between items-center mt-1">
        <div className="flex items-center">
          {status === 'on progress' && (totalPause > 0 || isPaused) && (
            <div
              className={cn(
                'flex gap-1 items-center text-[11px] text-destructive',
                isPaused ? 'font-medium animate-pulse' : '',
              )}
            >
              <CirclePause className="size-4" />
              <span>{totalPause}m</span>
            </div>
          )}

          {(status === 'pending' || status === 'done') && (
            <div className="flex items-center gap-2 text-[11px]">
              <span className="flex gap-1 items-center font-medium">
                <Timer className="size-4.5" /> {minute_activity || 0}m
              </span>
              {totalPause > 0 && (
                <span className="flex gap-1 items-center opacity-70 text-muted-foreground">
                  <CirclePause className="size-4" /> {totalPause}m
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex gap-1 items-center">
          {status === 'on progress' && (
            <Button
              onClick={togglePause}
              variant={isPaused ? 'destructive' : 'outline'}
              size="icon-xs"
              disabled={optimistic}
            >
              {isPaused ? <PlayIcon /> : <PauseIcon />}
            </Button>
          )}

          <Button
            onClick={handleUpdateTaskModal}
            variant="outline"
            size="icon-xs"
            disabled={optimistic}
          >
            <PencilSquareIcon />
          </Button>

          <Button
            onClick={handleDeleteTaskModal}
            variant="outline"
            size="icon-xs"
            disabled={optimistic}
          >
            <TrashIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(TaskCard, (prevProps, nextProps) => {
  return (
    prevProps.task.status === nextProps.task.status &&
    prevProps.task.optimistic === nextProps.task.optimistic &&
    prevProps.task.minute_pause === nextProps.task.minute_pause &&
    prevProps.task.pause_time === nextProps.task.pause_time &&
    prevProps.task.content === nextProps.task.content &&
    prevProps.task.detail === nextProps.task.detail &&
    prevProps.task.pic_id === nextProps.task.pic_id &&
    prevProps.task.scheduled_at === nextProps.task.scheduled_at
  );
});
