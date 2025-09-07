import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ActivityForm from './ActivityForm';
import PICForm from './PICForm';
import TaskForm from './TaskForm';
import useModal from '@/stores/modalStore';

const Modal = ({ title, idForm }) => {
  const isModalOpen = useModal((state) => state.isModalOpen);
  const setIsModalOpen = useModal((state) => state.setIsModalOpen);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {idForm === 'addActivity' && <ActivityForm />}
        {idForm === 'addPic' && <PICForm />}
        {idForm === 'addTask' && <TaskForm />}
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Batal
            </Button>
          </DialogClose>
          <Button type="submit" form={idForm}>
            Kirim
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
