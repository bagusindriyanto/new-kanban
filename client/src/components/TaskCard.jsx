import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { formatTimestamp } from '../services/formatTimestamp.js';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { PauseIcon } from '@heroicons/react/24/solid';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

  // Hooks untuk elemen dropdown menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Hooks untuk elemen draggable
  const { attributes, listeners, setNodeRef, isDragging, transform } =
    useDraggable({
      id,
    });

  const style = { transform: CSS.Translate.toString(transform) };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`cursor-grab rounded-lg px-3 py-2 shadow-sm hover:shadow-lg
        ${isDragging ? 'scale-105' : ''}
        ${status === 'todo' ? 'bg-rose-500' : ''} 
        ${status === 'on progress' ? 'bg-orange-500' : ''} 
        ${status === 'done' ? 'bg-green-500' : ''}
        ${status === 'archived' ? 'bg-gray-500' : ''}`}
    >
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
          </button>
          {status === 'on progress' && (
            <button className="rounded-full size-6 bg-black/15 text-white p-1">
              <PauseIcon />
            </button>
          )}
          <button className="rounded-full size-6 bg-black/15 text-white p-1">
            <ArrowRightIcon />
          </button> */}
          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full size-6 bg-black/15 text-white p-1">
                <EllipsisHorizontalIcon />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <span>
                  <PencilSquareIcon />
                </span>
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="text-red-500">
                  <TrashIcon />
                </span>
                <span className="text-red-500">Hapus</span>
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
