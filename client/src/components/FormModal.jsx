import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AddActivityForm from './AddActivityForm';
import AddPICForm from './AddPICForm';
import AddTaskForm from './AddTaskForm';
import UpdateTaskForm from './UpdateTaskForm';
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
        {formId === 'add-activity' && <AddActivityForm />}
        {formId === 'add-pic' && <AddPICForm />}
        {formId === 'add-task' && <AddTaskForm />}
        {formId === 'update-task' && <UpdateTaskForm />}
      </DialogContent>
    </Dialog>
  );
};

export default FormModal;
