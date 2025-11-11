import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import UpdateTaskForm from './UpdateTaskForm';
import NewUpdateTaskForm from './NewUpdateTaskForm';
import useFormModal from '@/stores/formModalStore';

const FormModal = () => {
  const isModalOpen = useFormModal((state) => state.isModalOpen);
  const setIsModalOpen = useFormModal((state) => state.setIsModalOpen);
  const title = useFormModal((state) => state.modalTitle);
  const formId = useFormModal((state) => state.formId);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {formId === 'update-task' && <UpdateTaskForm />}
        {formId === 'update-task-2' && <NewUpdateTaskForm />}
      </DialogContent>
    </Dialog>
  );
};

export default FormModal;
