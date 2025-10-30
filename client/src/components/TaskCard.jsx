import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatTimestamp } from '../services/formatTimestamp.js';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PauseIcon,
  PlayIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/solid';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import useFormModal from '@/stores/formModalStore.js';
import useConfirmModal from '@/stores/confirmModalStore.js';
import useTasks from '@/stores/taskStore';
import { useEffect, useRef, useState } from 'react';
import { columns } from '@/config/column.js';
import { useFetchPics } from '@/api/fetchPics.js';
import { useUpdateTask } from '@/api/updateTask.js';
import { cn } from '@/lib/utils';
import { fetchTasksQueryKey } from '@/api/fetchTasks.js';

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
  } = task;

  // State untuk PIC
  const { data: pics } = useFetchPics();
  // const pics = usePics((state) => state.pics);
  const picName = pics?.find((p) => p.id === pic_id)?.name;

  // State untuk form modal
  const setIsFormModalOpen = useFormModal((state) => state.setIsModalOpen);
  const setFormModalTitle = useFormModal((state) => state.setModalTitle);
  const setFormId = useFormModal((state) => state.setFormId);

  // State untuk confirm modal
  const setIsConfirmModalOpen = useConfirmModal(
    (state) => state.setIsModalOpen
  );

  // State untuk pilih task saat ini
  const setSelectedTaskId = useTasks((state) => state.setSelectedTaskId);
  const { mutateAsync: updateTaskMutate, isPending } = useUpdateTask({
    mutationConfig: {
      // When mutate is called:
      onMutate: async (newTask, context) => {
        // Cancel any outgoing refetches
        // (so they don't overwrite our optimistic update)
        await context.client.cancelQueries({ queryKey: fetchTasksQueryKey() });

        // Snapshot the previous value
        const previousTasks = context.client.getQueryData(fetchTasksQueryKey());

        // Optimistically update to the new value
        context.client.setQueryData(fetchTasksQueryKey(), (oldTasks) => {
          const filteredOldTasks = oldTasks.filter(
            (task) => task.id !== newTask.taskId
          );
          return [{ id: newTask.taskId, ...newTask.data }, ...filteredOldTasks];
        });
        // params.mutationConfig?.onMutate?.(newTask, context);
        // Return a result with the snapshotted value
        return { previousTasks };
      },
      // If the mutation fails,
      // use the result returned from onMutate to roll back
      onError: (err, newTask, onMutateResult, context) => {
        context.client.setQueryData(
          fetchTasksQueryKey(),
          onMutateResult.previousTasks
        );
      },
      // Always refetch after error or success:
      onSettled: (data, error, variables, onMutateResult, context) =>
        context.client.invalidateQueries({ queryKey: fetchTasksQueryKey() }),
    },
  });

  // Fungsi buka form modal
  const handleFormModal = (title, formId) => {
    // Buka modalnya
    setIsFormModalOpen(true);
    // Set id task yang dipilih
    setSelectedTaskId(id);
    // Set tipe modalnya
    setFormModalTitle(title);
    // Set id formnya
    setFormId(formId);
  };

  // Fungsi buka confirm modal
  const handleConfirmModal = () => {
    // Buka modalnya
    setIsConfirmModalOpen(true);
    // Set id task yang dipilih
    setSelectedTaskId(id);
  };

  // State untuk update status dengan tombol kanan / kiri
  const onMove = async (isRight) => {
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
    };
    try {
      await updateTaskMutate({ taskId: id, data });
    } catch (err) {
      toast.error('Gagal memperbarui task', {
        description: err.message,
      });
    }
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

  const togglePause = async () => {
    if (isPaused) {
      // Play: hitung durasi pause berjalan, tambahkan ke minute_pause, reset pause_time di DB
      const pauseEnd = Date.now();
      const pauseDuration = Math.floor(
        (pauseEnd - pauseStartRef.current) / 60000
      );
      await onPauseToggle(pauseDuration, true);
    } else {
      // Pause: set pause_time ke sekarang di DB
      const nowISO = new Date().toISOString();
      await onPauseToggle(0, false, nowISO);
    }
  };

  // Hitung pause berjalan
  const onPauseToggle = async (
    pauseMinutes,
    resetPauseTime = false,
    newPauseTime = null
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
    };
    try {
      await updateTaskMutate({ taskId: id, data });
      setIsPaused(!resetPauseTime);
    } catch (err) {
      toast.error('Gagal memperbarui task', {
        description: err.message,
      });
    }
  };

  return (
    <div
      className={cn('grow px-3 py-2 rounded-lg shadow-sm hover:shadow-lg', {
        'bg-todo-500': status === 'todo',
        'bg-progress-500': status === 'on progress',
        'bg-done-500': status === 'done',
        'bg-archived-500': status === 'archived',
        'opacity-30': isPending,
      })}
    >
      {/* Content */}
      <div className="flex justify-between gap-3 items-start">
        <h3 className="font-bold text-lg text-white">{content}</h3>
        <h4 className="font-semibold text-base text-white">{picName || '-'}</h4>
      </div>
      <p className="mt-1 font-medium text-sm text-white">{detail}</p>
      <div className="my-2 grid grid-cols-2 font-light text-[9px] text-white">
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
            disabled={status === 'todo' || status === 'archived' || isPaused}
          >
            <ArrowLeftIcon />
          </Button>
          {/* Tombol Pause */}
          {status === 'on progress' && (
            <Button
              onClick={togglePause}
              variant={status}
              size="icon-xs-rounded"
            >
              {isPaused ? <PlayIcon /> : <PauseIcon />}
            </Button>
          )}
          {/* Tombol Kanan */}
          <Button
            onClick={() => onMove(true)}
            variant={status}
            size="icon-xs-rounded"
            disabled={status === 'archived' || isPaused}
          >
            <ArrowRightIcon />
          </Button>
          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={status} size="icon-xs-rounded">
                <EllipsisHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => handleFormModal('Edit Task', 'updateTask')}
              >
                <PencilSquareIcon />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleConfirmModal}
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
      </div>
    </div>
  );
};

export default TaskCard;
