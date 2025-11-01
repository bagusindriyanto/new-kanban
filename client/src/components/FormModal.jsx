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
import { Spinner } from '@/components/ui/spinner';

const FormModal = () => {
  const isModalOpen = useFormModal((state) => state.isModalOpen);
  const setIsModalOpen = useFormModal((state) => state.setIsModalOpen);
  const title = useFormModal((state) => state.modalTitle);
  const formId = useFormModal((state) => state.formId);
  const isLoading = useFormModal((state) => state.isLoading);

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
        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="cursor-pointer"
              type="button"
              variant="secondary"
              disabled={isLoading}
            >
              Batal
            </Button>
          </DialogClose>
          <Button
            className={`cursor-pointer text-white ${
              formId === 'update-task'
                ? 'bg-blue-700 hover:bg-blue-800'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
            type="submit"
            form={formId}
            disabled={isLoading}
          >
            {isLoading && <Spinner />}
            {isLoading
              ? 'Mengirim...'
              : formId === 'update-task'
              ? 'Edit'
              : 'Tambah'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormModal;
