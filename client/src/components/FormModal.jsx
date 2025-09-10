import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
        {formId === 'addActivity' && <AddActivityForm />}
        {formId === 'addPic' && <AddPICForm />}
        {formId === 'addTask' && <AddTaskForm />}
        {formId === 'updateTask' && <UpdateTaskForm />}
        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="cursor-pointer"
              type="button"
              variant="secondary"
            >
              Batal
            </Button>
          </DialogClose>
          <Button
            className={`cursor-pointer ${
              formId === 'updateTask'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-green-700 hover:bg-green-800'
            }`}
            type="submit"
            form={formId}
          >
            {formId === 'updateTask' ? 'Edit' : 'Tambah'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormModal;
