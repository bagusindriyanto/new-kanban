import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import AddTaskForm from './AddTaskForm';
import { useState } from 'react';
import { useAddTask } from '@/api/addTask';
import { ClipboardList } from 'lucide-react';

const AddTaskModal = ({
  buttonVariant = 'default',
  buttonSize = 'default',
  hideButton = false,
}) => {
  const [open, setOpen] = useState(false);
  const { mutateAsync: addTaskMutation, isPending } = useAddTask();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {hideButton ? (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <ClipboardList />
            Tambah Task
          </DropdownMenuItem>
        ) : (
          <Button variant={buttonVariant} size={buttonSize}>
            Tambah Task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Tambah Task</DialogTitle>
        </DialogHeader>
        <AddTaskForm mutateAsync={addTaskMutation} onOpenChange={setOpen} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" disabled={isPending}>
              Batal
            </Button>
          </DialogClose>
          <Button
            type="submit"
            variant="success"
            form="add-task"
            disabled={isPending}
          >
            {isPending && <Spinner />}
            {isPending ? 'Mengirim...' : 'Tambah'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
