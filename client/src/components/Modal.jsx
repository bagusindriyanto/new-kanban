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
import UpdateTaskForm from './UpdateTaskForm';
import useModal from '@/stores/modalStore';

const Modal = () => {
  const isModalOpen = useModal((state) => state.isModalOpen);
  const setIsModalOpen = useModal((state) => state.setIsModalOpen);
  const title = useModal((state) => state.modalTitle);
  const formId = useModal((state) => state.formId);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {formId === 'addActivity' && <ActivityForm />}
        {formId === 'addPic' && <PICForm />}
        {formId === 'addTask' && <TaskForm />}
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Batal
            </Button>
          </DialogClose>
          <Button type="submit" form={formId}>
            Kirim
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
