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
import { useState, useCallback } from 'react';
import { useAddTask } from '@/api/addTask';
import { Plus } from 'lucide-react';

const AddTaskModal = ({
  open: openProp,
  onOpenChange: setOpenProp,
  buttonVariant = 'default',
  buttonSize = 'default',
  showButton = true,
}) => {
  const [_open, _setOpen] = useState(false);
  const open = openProp ?? _open;
  const setOpen = useCallback(
    (value) => {
      const openState = typeof value === 'function' ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
    },
    [open, setOpenProp],
  );

  const { mutateAsync: addTaskMutation, isPending } = useAddTask();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {showButton && (
        <DialogTrigger
          render={<Button variant={buttonVariant} size={buttonSize} />}
        >
          <Plus data-icon="inline-start" />
          Tambah Task
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Task</DialogTitle>
        </DialogHeader>
        <AddTaskForm mutateAsync={addTaskMutation} onOpenChange={setOpen} />
        <DialogFooter>
          <DialogClose
            render={<Button variant="secondary" disabled={isPending} />}
          >
            Batal
          </DialogClose>
          <Button
            type="submit"
            variant="success"
            form="add-task"
            disabled={isPending}
          >
            {isPending && <Spinner data-icon="inline-start" />}
            {isPending ? 'Mengirim...' : 'Tambah'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
