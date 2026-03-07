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
  ArrowLeftIcon,
  ArrowRightIcon,
  PauseIcon,
  PlayIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/solid';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import useUpdateTaskModal from '@/stores/updateTaskModalStore';
import useDeleteTaskModal from '@/stores/deleteTaskModalStore';
import useFilter from '@/stores/filterStore';
import { memo, useEffect, useRef, useState } from 'react';
import { columns } from '@/config/column';
import { useUpdateTask } from '@/api/updateTask';
import { cn } from '@/lib/utils';
import { User, Timer, CirclePause } from 'lucide-react';
// Urutan Status dipindah ke luar kompoen
const statusOrder = columns.map((column) => column.id);

const TaskCard = ({ task }) => {
  // Destructure isi props
  const {
    id,
    pic_id,
    assigner_id,
    status,
    content,
    detail,
    timestamp_todo,
    timestamp_progress,
    timestamp_done,
    timestamp_archived,
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

  // State untuk update status dengan tombol kanan / kiri
  const onMove = (isRight) => {
    const now = formatToSQL(new Date());
    let todo = timestamp_todo;
    let progress = timestamp_progress;
    let done = timestamp_done;
    let archived = timestamp_archived;
    let pause = pause_time || null;
    let mnt_activity = minute_activity || 0;
    let mnt_pause = minute_pause || 0;
    let newStatus = null;
    const currentIndex = statusOrder.indexOf(status);
    if (isRight) {
      if (currentIndex < statusOrder.length - 1) {
        newStatus = statusOrder[currentIndex + 1];
        switch (newStatus) {
          case 'on progress':
            progress = now;
            break;
          case 'done':
            done = now;
            if (timestamp_progress) {
              const diff = new Date(now) - new Date(timestamp_progress);
              mnt_activity = Math.floor(diff / 60000) - mnt_pause;
            }
            break;
          case 'archived':
            archived = now;
            break;
        }
      } else return;
    } else {
      if (currentIndex > 0) {
        newStatus = statusOrder[currentIndex - 1];
        switch (newStatus) {
          case 'todo':
            progress = null;
            pause = null;
            mnt_pause = 0;
            break;
          case 'on progress':
            done = null;
            mnt_activity = 0;
            break;
          case 'done':
            archived = null;
            break;
        }
      } else return;
    }
    const data = {
      pic_id,
      assigner_id,
      status: newStatus,
      content,
      detail,
      timestamp_todo: todo,
      timestamp_progress: progress,
      timestamp_done: done,
      timestamp_archived: archived,
      minute_activity: mnt_activity,
      minute_pause: mnt_pause,
      pause_time: pause,
      scheduled_at,
    };
    updateTaskMutate({ ...data, id });
  };

  // State untuk hitung durasi pause
  const isPausedInitial = pause_time ? true : false;
  const [isPaused, setIsPaused] = useState(isPausedInitial);
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

    const data = {
      pic_id,
      assigner_id,
      status,
      content,
      detail,
      timestamp_todo,
      timestamp_progress,
      timestamp_done,
      timestamp_archived,
      minute_activity,
      minute_pause: updatedMinutePause,
      pause_time: updatedPauseTime,
      scheduled_at,
    };
    updateTaskMutate({ ...data, id });
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
      className={cn(
        'group flex flex-col gap-2 rounded-lg border bg-card p-3 shadow-sm transition-all hover:shadow-md relative overflow-hidden',
        {
          'border-l-4 border-l-todo-500': status === 'todo',
          'border-l-4 border-l-progress-500': status === 'on progress',
          'border-l-4 border-l-done-500': status === 'done',
          'border-l-4 border-l-archived-500': status === 'archived',
          'animate-pulse pointer-events-none': optimistic,
        },
      )}
    >
      {/* 1. HEADER: Title & Menu */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-bold text-base leading-tight text-card-foreground line-clamp-2">
          {content}
        </h3>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground -mr-1 -mt-1 shadow-none"
              disabled={optimistic}
            >
              <EllipsisHorizontalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={handleUpdateTaskModal}>
              <PencilSquareIcon className="mr-2 size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDeleteTaskModal}
              variant="destructive"
            >
              <TrashIcon className="mr-2 size-4" />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 2. BODY: Description */}
      {detail && <p className="text-sm line-clamp-2 leading-snug">{detail}</p>}

      {/* 3. ASSIGNEE & METADATA */}
      <div className="flex flex-col gap-2 mt-1">
        {/* Assignee Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="size-3.5" />
            <span className="font-medium text-foreground">
              {pic_name || '-'}
            </span>
          </div>
          {assigner_id && (
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
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex size-2 rounded-full bg-red-500"></span>
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

          {(status === 'on progress' || status === 'done') && (
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

          {status === 'done' && (
            <div className="flex gap-1 justify-between">
              <p className="font-medium">Selesai:</p>
              <p className="tabular-nums">{parseFromSQL(timestamp_done)}</p>
            </div>
          )}

          {status === 'archived' && (
            <div className="flex gap-1 justify-between">
              <p className="font-medium">Arsip:</p>
              <p className="tabular-nums">{parseFromSQL(timestamp_archived)}</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. FOOTER: Controls & Schedule */}
      <div className="mt-1 flex items-center justify-between gap-2">
        <div className="flex items-center">
          {status === 'on progress' && (totalPause > 0 || isPaused) && (
            <div
              className={cn(
                'flex items-center gap-1 text-[11px] text-destructive',
                isPaused ? 'font-medium animate-pulse' : '',
              )}
            >
              <CirclePause className="size-4" />
              <span>{totalPause}m</span>
            </div>
          )}
          {(status === 'done' || status === 'archived') && (
            <div className="flex items-center gap-2 text-[11px]">
              <span className="font-medium flex items-center gap-1">
                <Timer className="size-4.5" /> {minute_activity || 0}m
              </span>
              {totalPause > 0 && (
                <span className="opacity-70 flex items-center gap-1 text-muted-foreground">
                  <CirclePause className="size-4" /> {totalPause}m
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <Button
            onClick={() => onMove(false)}
            variant="outline"
            size="icon-xs"
            disabled={
              status === 'todo' ||
              status === 'archived' ||
              isPaused ||
              optimistic
            }
          >
            <ArrowLeftIcon />
          </Button>

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
            onClick={() => onMove(true)}
            variant="outline"
            size="icon-xs"
            disabled={status === 'archived' || isPaused || optimistic}
          >
            <ArrowRightIcon />
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
