import { Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import AddActivityModal from '@/components/activity/AddActivityModal';
import AddTaskModal from '@/components/tasks/AddTaskModal';
import { Layers } from 'lucide-react';
import { ClipboardList } from 'lucide-react';
import { useState } from 'react';

const AddItemsDropdown = () => {
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [openActivityModal, setOpenActivityModal] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button />}>
          <Plus data-icon="inline-start" />
          Tambah
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-fit">
          <DropdownMenuItem onClick={() => setOpenTaskModal(true)}>
            <ClipboardList />
            Tambah Task
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpenActivityModal(true)}>
            <Layers />
            Tambah Aktivitas
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AddTaskModal
        open={openTaskModal}
        onOpenChange={setOpenTaskModal}
        showButton={false}
      />

      <AddActivityModal
        open={openActivityModal}
        onOpenChange={setOpenActivityModal}
        showButton={false}
      />
    </>
  );
};

export default AddItemsDropdown;
