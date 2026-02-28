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
import AddActivityForm from './AddActivityForm';
import { useState } from 'react';
import { useAddActivity } from '@/api/addActivity';
import { Layers } from 'lucide-react';

const AddActivityModal = ({ hideButton = false }) => {
  const [open, setOpen] = useState(false);
  const { mutateAsync: addActivityMutation, isPending } = useAddActivity();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {hideButton ? (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Layers />
            Tambah Aktivitas
          </DropdownMenuItem>
        ) : (
          <Button variant="nav" size="sm">
            Tambah Aktivitas
          </Button>
        )}
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Tambah Aktivitas</DialogTitle>
        </DialogHeader>
        <AddActivityForm
          mutateAsync={addActivityMutation}
          onOpenChange={setOpen}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" disabled={isPending}>
              Batal
            </Button>
          </DialogClose>
          <Button
            type="submit"
            variant="success"
            form="add-activity"
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

export default AddActivityModal;
