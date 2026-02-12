import { Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import AddActivityModal from '@/components/AddActivityModal';
import AddPICModal from '@/components/AddPICModal';
import AddTaskModal from '@/components/AddTaskModal';

const AddItemsDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="nav" size="sm">
          <Plus />
          Tambah
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <AddActivityModal hideButton />
        <AddPICModal hideButton />
        <AddTaskModal hideButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddItemsDropdown;
