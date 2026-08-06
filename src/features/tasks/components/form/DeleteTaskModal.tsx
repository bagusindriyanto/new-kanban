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
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { useDeleteTask } from '@/features/tasks/api/deleteTask';
import { Trash2Icon } from 'lucide-react';
import useModalStore from '@/stores/modalStore';

const DeleteTaskModal = () => {
  const isDeleteOpen = useModalStore((state) => state.isDeleteOpen);
  const setDeleteOpen = useModalStore((state) => state.setDeleteOpen);
  const selectedTask = useModalStore((state) => state.selectedTask);

  const { mutateAsync: deleteTaskMutation, isPending } = useDeleteTask();

  const onSubmit = () => {
    if (!selectedTask?.id) return;

    toast.promise(deleteTaskMutation(selectedTask.id), {
      loading: 'Sedang menghapus task...',
      success: () => {
        setDeleteOpen(false);
        return 'Task berhasil dihapus';
      },
      error: (err) => {
        return {
          message: 'Task gagal dihapus',
          description: err?.message || null,
        };
      },
    });
  };

  return (
    <AlertDialog
      open={isDeleteOpen}
      onOpenChange={(open) => setDeleteOpen(open, selectedTask)}
    >
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
          <AlertDialogCancel
            onClick={() => setDeleteOpen(false)}
            disabled={isPending}
          >
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
