import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import UpdateTaskForm from './UpdateTaskForm';
import useUpdateTaskModal from '@/stores/updateTaskModalStore';

const UpdateTaskModal = () => {
  const isModalOpen = useUpdateTaskModal((state) => state.isModalOpen);
  const setIsModalOpen = useUpdateTaskModal((state) => state.setIsModalOpen);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Update Task</DialogTitle>
        </DialogHeader>
        <UpdateTaskForm />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTaskModal;
