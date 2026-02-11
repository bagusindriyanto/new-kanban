import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatTimestamp } from '@/utils/formatTimestamp';
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
import { useEffect, useRef, useState } from 'react';
import { columns } from '@/config/column';
import { useFetchPICs } from '@/api/fetchPICs';
import { useUpdateTask } from '@/api/updateTask';
import { cn } from '@/lib/utils';
import { CalendarClock } from 'lucide-react';

const TaskCard = ({ task }) => {
  // Urutan Status
  const statusOrder = columns.map((column) => column.id);
  // Destructure isi props
  const {
    id,
    pic_id,
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
  } = task;

  // State untuk PIC
  const { data: pics } = useFetchPICs();
  const picName = pics?.find((p) => p.id === pic_id)?.name;

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
      onError: (err, _newTask, _onMutateResult, _context) => {
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
    // Buka modalnya
    setIsUpdateTaskModalOpen(true);
    // Set id task yang dipilih
    setSelectedTaskId(id);
  };

  // Fungsi buka confirm modal
  const handleDeleteTaskModal = () => {
    // Buka modalnya
    setIsDeleteTaskModalOpen(true);
    // Set id task yang dipilih
    setSelectedTaskId(id);
  };

  // State untuk update status dengan tombol kanan / kiri
  const onMove = (isRight) => {
    const now = new Date().toISOString();
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
    updateTaskMutate({ taskId: id, data });
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
      const nowISO = new Date().toISOString();
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
    updateTaskMutate({ taskId: id, data });
    setIsPaused(!resetPauseTime);
  };

  return (
    <div
      className={cn('grow px-3 py-2 rounded-lg shadow-sm hover:shadow-lg', {
        'bg-todo-500': status === 'todo',
        'bg-progress-500': status === 'on progress',
        'bg-done-500': status === 'done',
        'bg-archived-500': status === 'archived',
        'animate-pulse': optimistic,
      })}
    >
      {/* Content */}
      <div className="flex justify-between gap-3 items-start">
        <h3 className="font-bold text-lg text-white">{content}</h3>
        <h4 className="font-semibold text-base text-white">{picName || '-'}</h4>
      </div>
      <p className="mt-1 font-medium text-sm text-white">{detail}</p>
      <div className="my-2 grid grid-cols-2 font-light text-[10px] text-white">
        <p>Todo: {timestamp_todo ? formatTimestamp(timestamp_todo) : '-'}</p>
        <p>
          Progress:{' '}
          {timestamp_progress ? formatTimestamp(timestamp_progress) : '-'}
        </p>
        <p>Done: {timestamp_done ? formatTimestamp(timestamp_done) : '-'}</p>
        <p>
          Archived:{' '}
          {timestamp_archived ? formatTimestamp(timestamp_archived) : '-'}
        </p>
        <p>Pause: {pause_time ? formatTimestamp(pause_time) : '-'}</p>
        <p>Pause Minutes: {totalPause}</p>
      </div>
      <div className="flex flex-row-reverse justify-between items-center">
        <div className="flex gap-1">
          {/* Control Button */}
          {/* Tombol Kiri */}
          <Button
            onClick={() => onMove(false)}
            variant={status}
            size="icon-xs-rounded"
            disabled={
              status === 'todo' ||
              status === 'archived' ||
              isPaused ||
              optimistic
            }
          >
            <ArrowLeftIcon />
          </Button>
          {/* Tombol Pause */}
          {status === 'on progress' && (
            <Button
              onClick={togglePause}
              variant={status}
              size="icon-xs-rounded"
              disabled={optimistic}
            >
              {isPaused ? <PlayIcon /> : <PauseIcon />}
            </Button>
          )}
          {/* Tombol Kanan */}
          <Button
            onClick={() => onMove(true)}
            variant={status}
            size="icon-xs-rounded"
            disabled={status === 'archived' || isPaused || optimistic}
          >
            <ArrowRightIcon />
          </Button>
          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={status}
                size="icon-xs-rounded"
                disabled={optimistic}
              >
                <EllipsisHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleUpdateTaskModal}
              >
                <PencilSquareIcon />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleDeleteTaskModal}
                variant="destructive"
              >
                <TrashIcon />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {(status === 'done' || status === 'archived') && (
          <p className="font-medium text-sm text-white">
            Activity Minutes:{' '}
            <span className="font-normal">{minute_activity || 0}</span>
          </p>
        )}
        {status === 'todo' && scheduled_at && (
          <div className="flex items-center gap-1 px-1.5 py-1 rounded-full bg-todo-600">
            <CalendarClock className="size-4" />
            <span className="font-medium text-[10px] text-white">
              {formatTimestamp(scheduled_at)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
