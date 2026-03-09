import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import useDeleteTaskModal from '@/stores/deleteTaskModalStore';
import useFilter from '@/stores/filterStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useDeleteTask } from '@/api/deleteTask';

const DeleteTaskModal = () => {
  const isModalOpen = useDeleteTaskModal((state) => state.isModalOpen);
  const setIsModalOpen = useDeleteTaskModal((state) => state.setIsModalOpen);

  const { mutateAsync: deleteTaskMutation, isPending } = useDeleteTask();

  const selectedTaskId = useFilter((state) => state.selectedTaskId);

  const onSubmit = () => {
    toast.promise(deleteTaskMutation(selectedTaskId), {
      loading: () => {
        return 'Sedang menghapus task...';
      },
      success: () => {
        setIsModalOpen(false);
        return 'Task berhasil dihapus.';
      },
      error: (err) => {
        return {
          message:
            err.response?.data?.message ||
            err.message ||
            'Gagal menghapus task.',
          description: err.response?.data?.error_detail || null,
        };
      },
    });
  };

  const onClose = () => {
    setIsModalOpen(false);
  };

  return (
    <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Task?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Tindakan ini akan menghapus
            task secara permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {/* Button Modal */}
        <AlertDialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isPending}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="danger"
            onClick={onSubmit}
            disabled={isPending}
          >
            {isPending && <Spinner data-icon="inline-start" />}
            {isPending ? 'Menghapus...' : 'Hapus'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTaskModal;
