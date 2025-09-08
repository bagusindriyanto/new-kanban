import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatTimestamp } from '../services/formatTimestamp.js';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid';
import { GripVertical } from 'lucide-react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { PauseIcon } from '@heroicons/react/24/solid';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import useModal from '@/stores/modalStore';
import useTasks from '@/stores/taskStore';
// import { Trash2Icon } from 'lucide-react';

const TaskCard = ({ picName, task }) => {
  // Destructure isi props
  const {
    id,
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

  // State untuk modal
  const setIsModalOpen = useModal((state) => state.setIsModalOpen);
  const setModalTitle = useModal((state) => state.setModalTitle);
  const setFormId = useModal((state) => state.setFormId);

  // State untuk pilih task saat ini
  const setSelectedTaskId = useTasks((state) => state.setSelectedTaskId);

  const handleOpenModal = (taskId, title, formId) => {
    // Buka modalnya
    setIsModalOpen(true);
    // Set id task yang dipilih
    setSelectedTaskId(taskId);
    // Set tipe modalnya
    setModalTitle(title);
    // Set id formnya
    setFormId(formId);
  };

  // Hooks untuk elemen draggable
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    isDragging,
    transform,
  } = useDraggable({
    id,
  });

  const style = { transform: CSS.Translate.toString(transform) };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`cursor-default flex flex-row rounded-lg overflow-hidden shadow-sm hover:shadow-lg
        ${isDragging ? 'scale-105' : ''}
        ${status === 'todo' ? 'bg-rose-500' : ''} 
        ${status === 'on progress' ? 'bg-orange-500' : ''} 
        ${status === 'done' ? 'bg-green-500' : ''}
        ${status === 'archived' ? 'bg-gray-500' : ''}`}
    >
      {/* Handle Drag */}
      <div
        ref={setActivatorNodeRef}
        {...listeners}
        {...attributes}
        className={`cursor-grab flex justify-center items-center text-white/50
        ${status === 'todo' ? 'bg-rose-600' : ''} 
        ${status === 'on progress' ? 'bg-orange-600' : ''} 
        ${status === 'done' ? 'bg-green-600' : ''}
        ${status === 'archived' ? 'bg-gray-600' : ''}`}
      >
        <GripVertical className="size-5" />
      </div>
      {/* Content */}
      <div className="flex-1 px-3 py-2">
        <div className="flex justify-between gap-2 items-start">
          <h3 className="font-bold text-lg text-white">{content}</h3>
          <h4 className="font-medium text-base text-white">{picName || '-'}</h4>
        </div>
        <p className="mt-1 font-medium text-sm text-white">{detail}</p>
        <div className="my-2 grid grid-cols-2 font-extralight text-[10px] text-white">
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
          <p>Pause Minutes: {minute_pause}</p>
        </div>
        <div className="flex flex-row-reverse justify-between items-center">
          <div className="flex gap-1">
            {/* Control Button */}
            {/* <button className="rounded-full size-6 bg-black/15 text-white p-1">
            <ArrowLeftIcon />
          </button> */}
            {status === 'on progress' && (
              <button
                className={`cursor-pointer rounded-full size-6 text-white p-1 transition duration-300 ease-in-out ${
                  status === 'todo' ? 'bg-rose-600 hover:bg-rose-400' : ''
                } ${
                  status === 'on progress'
                    ? 'bg-orange-600 hover:bg-orange-400'
                    : ''
                } ${
                  status === 'done' ? 'bg-green-600 hover:bg-green-400' : ''
                } ${
                  status === 'archived' ? 'bg-gray-600 hover:bg-gray-400' : ''
                }`}
              >
                {pause_time ? <PauseIcon /> : <p>Play</p>}
              </button>
            )}
            {/* <button className="rounded-full size-6 bg-black/15 text-white p-1">
            <ArrowRightIcon />
          </button> */}
            {/* Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`cursor-pointer rounded-full size-6 text-white p-1 transition duration-300 ease-in-out ${
                    status === 'todo' ? 'bg-rose-600 hover:bg-rose-400' : ''
                  } ${
                    status === 'on progress'
                      ? 'bg-orange-600 hover:bg-orange-400'
                      : ''
                  } ${
                    status === 'done' ? 'bg-green-600 hover:bg-green-400' : ''
                  } ${
                    status === 'archived' ? 'bg-gray-600 hover:bg-gray-400' : ''
                  }`}
                >
                  <EllipsisHorizontalIcon />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem className="m-0 p-0">
                  <button
                    onClick={() =>
                      handleOpenModal(id, 'Edit Task', 'updateTask')
                    }
                    className="cursor-pointer size-full p-2 flex text-center items-center gap-2"
                  >
                    <PencilSquareIcon />
                    <span>Edit</span>
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem className="m-0 p-0">
                  <button className="cursor-pointer size-full p-2 flex text-center items-center gap-2">
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
    </div>
  );
};

export default TaskCard;
