import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import AddTaskForm from './AddTaskForm';
import { useState } from 'react';
import { PlusIcon } from 'lucide-react';

const AddTaskModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <PlusIcon data-icon="inline-start" />
        Tambah Task
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Task</DialogTitle>
        </DialogHeader>
        <AddTaskForm onOpenChange={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
