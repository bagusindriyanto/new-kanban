import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
// import AddForm from './AddForm';
import TaskForm from './TaskForm';

const Modal = ({ open, onOpenChange, title }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {/* <AddForm /> */}
        <TaskForm />
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
