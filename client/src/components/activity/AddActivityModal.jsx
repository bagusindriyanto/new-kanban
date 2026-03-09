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
import AddActivityForm from './AddActivityForm';
import { useState, useCallback } from 'react';
import { useAddActivity } from '@/api/addActivity';
import { Layers } from 'lucide-react';

const AddActivityModal = ({
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

  const { mutateAsync: addActivityMutation, isPending } = useAddActivity();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {showButton && (
        <DialogTrigger
          render={<Button variant={buttonVariant} size={buttonSize} />}
        >
          <Layers data-icon="inline-start" />
          Tambah Aktivitas
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Aktivitas</DialogTitle>
        </DialogHeader>
        <AddActivityForm
          mutateAsync={addActivityMutation}
          onOpenChange={setOpen}
        />
        <DialogFooter>
          <DialogClose
            render={<Button variant="secondary" disabled={isPending} />}
          >
            Batal
          </DialogClose>
          <Button
            type="submit"
            variant="success"
            form="add-activity"
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

export default AddActivityModal;
