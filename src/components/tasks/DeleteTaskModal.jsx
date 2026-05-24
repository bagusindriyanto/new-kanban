import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogMedia,
} from '@/components/ui/alert-dialog';
import useDeleteTaskModal from '@/stores/deleteTaskModalStore';
import useFilter from '@/stores/filterStore';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { useDeleteTask } from '@/api/deleteTask';
import { Trash2Icon } from 'lucide-react';

const DeleteTaskModal = () => {
  const isModalOpen = useDeleteTaskModal((state) => state.isModalOpen);
  const setIsModalOpen = useDeleteTaskModal((state) => state.setIsModalOpen);

  const { mutateAsync: deleteTaskMutation, isPending } = useDeleteTask();

  const selectedTaskId = useFilter((state) => state.selectedTaskId);

  const onSubmit = () => {
    toast.promise(deleteTaskMutation(selectedTaskId), {
      loading: 'Sedang menghapus task...',
      success: () => {
        setIsModalOpen(false);
        return 'Task berhasil dihapus';
      },
      error: (err) => {
        return {
          message: 'Task gagal dihapus',
          description: err.response?.data?.message || null,
        };
      },
    });
  };

  const onClose = () => {
    setIsModalOpen(false);
  };

  return (
    <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Hapus Task?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Tindakan ini akan menghapus
            task secara permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {/* Button Modal */}
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isPending}>
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onSubmit}
            disabled={isPending}
          >
            {isPending && <Spinner data-icon="inline-start" />}
            {isPending ? 'Menghapus...' : 'Hapus'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTaskModal;
