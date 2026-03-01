import { Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import AddActivityModal from '@/components/activity/AddActivityModal';
import AddTaskModal from '@/components/tasks/AddTaskModal';

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
        <AddTaskModal hideButton />
        <DropdownMenuSeparator />
        <AddActivityModal hideButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddItemsDropdown;
