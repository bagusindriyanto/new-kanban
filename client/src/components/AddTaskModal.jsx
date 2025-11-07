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
import AddTaskForm from './AddTaskForm';
import { useState } from 'react';
import { useAddTask } from '@/api/addTask';

const AddTaskModal = () => {
  const [open, setOpen] = useState(false);
  const { mutateAsync: addTaskMutation, isPending } = useAddTask();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="nav" size="sm">
          Tambah Task
        </Button>
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
