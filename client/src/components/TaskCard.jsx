import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import usePics from '@/stores/picStore.js';
import { useEffect, useRef, useState } from 'react';

const TaskCard = ({ task }) => {
  // Kolom status
  const columns = [
    {
      id: 'todo',
      title: 'TO DO',
    },
    {
      id: 'on progress',
      title: 'ON PROGRESS',
    },
    {
      id: 'done',
      title: 'DONE',
    },
    {
      id: 'archived',
      title: 'ARCHIVED',
    },
  ];
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
  const pics = usePics((state) => state.pics);
  const picName = pics.find((p) => p.id === pic_id)?.name;

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
  const updateTask = useTasks((state) => state.updateTask);

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
    await updateTask(id, data);
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
      setIsPaused(false);
    } else {
      // Pause: set pause_time ke sekarang di DB
      const nowISO = new Date().toISOString();
      await onPauseToggle(0, false, nowISO);
      setIsPaused(true);
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
    await updateTask(id, data);
  };

  return (
    <div
      className={`grow px-3 py-2 rounded-lg shadow-sm hover:shadow-lg
        ${status === 'todo' ? 'bg-todo-500' : ''} 
        ${status === 'on progress' ? 'bg-progress-500' : ''} 
        ${status === 'done' ? 'bg-done-500' : ''}
        ${status === 'archived' ? 'bg-archived-500' : ''}`}
    >
      {/* Content */}
      <div className="flex justify-between gap-2 items-start">
        <h3 className="font-bold text-lg text-white">{content}</h3>
        <h4 className="font-medium text-base text-white">{picName || '-'}</h4>
      </div>
      <p className="mt-1 font-medium text-sm text-white">{detail}</p>
      <div className="my-2 grid grid-cols-2 font-light text-[11px] text-white">
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
          <button
            onClick={() => onMove(false)}
            className={`cursor-pointer rounded-full size-6 text-white p-1 disabled:opacity-25 disabled:cursor-not-allowed transition duration-300 ease-in-out ${
              status === 'todo' ? 'bg-todo-600 enabled:hover:bg-todo-400' : ''
            } ${
              status === 'on progress'
                ? 'bg-progress-600 enabled:hover:bg-progress-400'
                : ''
            } ${
              status === 'done' ? 'bg-done-600 enabled:hover:bg-done-400' : ''
            } ${
              status === 'archived'
                ? 'bg-archived-600 enabled:hover:bg-archived-400'
                : ''
            }`}
            disabled={status === 'todo' || status === 'archived' || isPaused}
          >
            <ArrowLeftIcon />
          </button>
          {/* Tombol Pause */}
          {status === 'on progress' && (
            <button
              onClick={togglePause}
              className={`cursor-pointer rounded-full size-6 text-white p-1 transition duration-300 ease-in-out ${
                status === 'todo' ? 'bg-todo-600 hover:bg-todo-400' : ''
              } ${
                status === 'on progress'
                  ? 'bg-progress-600 hover:bg-progress-400'
                  : ''
              } ${status === 'done' ? 'bg-done-600 hover:bg-done-400' : ''} ${
                status === 'archived'
                  ? 'bg-archived-600 hover:bg-archived-400'
                  : ''
              }`}
            >
              {isPaused ? <PlayIcon /> : <PauseIcon />}
            </button>
          )}
          {/* Tombol Kanan */}
          <button
            onClick={() => onMove(true)}
            className={`cursor-pointer rounded-full size-6 text-white p-1 disabled:opacity-25 disabled:cursor-not-allowed transition duration-300 ease-in-out ${
              status === 'todo' ? 'bg-todo-600 enabled:hover:bg-todo-400' : ''
            } ${
              status === 'on progress'
                ? 'bg-progress-600 enabled:hover:bg-progress-400'
                : ''
            } ${
              status === 'done' ? 'bg-done-600 enabled:hover:bg-done-400' : ''
            } ${
              status === 'archived'
                ? 'bg-archived-600 enabled:hover:bg-archived-400'
                : ''
            }`}
            disabled={status === 'archived' || isPaused}
          >
            <ArrowRightIcon />
          </button>
          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`cursor-pointer rounded-full size-6 text-white p-1 transition duration-300 ease-in-out ${
                  status === 'todo' ? 'bg-todo-600 hover:bg-todo-400' : ''
                } ${
                  status === 'on progress'
                    ? 'bg-progress-600 hover:bg-progress-400'
                    : ''
                } ${status === 'done' ? 'bg-done-600 hover:bg-done-400' : ''} ${
                  status === 'archived'
                    ? 'bg-archived-600 hover:bg-archived-400'
                    : ''
                }`}
              >
                <EllipsisHorizontalIcon />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="m-0 p-0">
                <button
                  onClick={() => handleFormModal('Edit Task', 'updateTask')}
                  className="cursor-pointer size-full p-2 flex text-center items-center gap-2"
                >
                  <PencilSquareIcon />
                  <span>Edit</span>
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem className="m-0 p-0">
                <button
                  onClick={handleConfirmModal}
                  className="cursor-pointer size-full p-2 flex text-center items-center gap-2"
                >
                  <TrashIcon className="text-red-500" />
                  <span className="text-red-500">Hapus</span>
                </button>
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
