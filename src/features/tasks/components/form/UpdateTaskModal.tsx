import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import UpdateTaskForm from './UpdateTaskForm';
import useModalStore from '@/stores/modalStore';

const UpdateTaskModal = () => {
  const isUpdateOpen = useModalStore((state) => state.isUpdateOpen);
  const selectedTask = useModalStore((state) => state.selectedTask);
  const setUpdateOpen = useModalStore((state) => state.setUpdateOpen);

  return (
    <Dialog
      open={isUpdateOpen}
      onOpenChange={(open) => setUpdateOpen(open, selectedTask)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <UpdateTaskForm />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTaskModal;
