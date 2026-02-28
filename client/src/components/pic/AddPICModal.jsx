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
import AddPICForm from './AddPICForm';
import { useState } from 'react';
import { useAddPIC } from '@/api/addPIC';
import { UserPlus } from 'lucide-react';

const AddPICModal = ({ hideButton = false }) => {
  const [open, setOpen] = useState(false);
  const { mutateAsync: addPICMutation, isPending } = useAddPIC();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {hideButton ? (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <UserPlus />
            Tambah PIC
          </DropdownMenuItem>
        ) : (
          <Button variant="nav" size="sm">
            Tambah PIC
          </Button>
        )}
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
