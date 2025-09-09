import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import useConfirmModal from '@/stores/confirmModalStore';
import useTasks from '@/stores/taskStore';
import { toast } from 'sonner';

export default function ConfirmModal() {
  const selectedTaskId = useTasks((state) => state.selectedTaskId);
  const deleteTask = useTasks((state) => state.deleteTask);
  const error = useTasks((state) => state.error);
  const isModalOpen = useConfirmModal((state) => state.isModalOpen);
  const setIsModalOpen = useConfirmModal((state) => state.setIsModalOpen);

  const handleDeleteTask = async () => {
    await toast.promise(deleteTask(selectedTaskId), {
      loading: 'Sedang menghapus task...',
      success: 'Task berhasil dihapus',
      error: `Error: ${error}`,
    });
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
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteTask}
            className="cursor-pointer bg-red-500 hover:bg-red-600"
          >
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
