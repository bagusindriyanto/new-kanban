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
import AddPICForm from './AddPICForm';
import { useState } from 'react';
import { useAddPIC } from '@/api/addPIC';

const AddPICModal = () => {
  const [open, setOpen] = useState(false);
  const { mutateAsync: addPICMutation, isPending } = useAddPIC();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="nav" size="sm">
          Tambah PIC
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Tambah PIC</DialogTitle>
        </DialogHeader>
        <AddPICForm mutateAsync={addPICMutation} onOpenChange={setOpen} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" disabled={isPending}>
              Batal
            </Button>
          </DialogClose>
          <Button
            type="submit"
            variant="success"
            form="add-pic"
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

export default AddPICModal;
