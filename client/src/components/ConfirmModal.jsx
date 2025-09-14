import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import useConfirmModal from '@/stores/confirmModalStore';
import useTasks from '@/stores/taskStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const FormSchema = z.object({
  password: z.string().nonempty({ message: 'Mohon isi password.' }),
});

export default function ConfirmModal() {
  const selectedTaskId = useTasks((state) => state.selectedTaskId);
  const deleteTask = useTasks((state) => state.deleteTask);
  const error = useTasks((state) => state.error);
  const isModalOpen = useConfirmModal((state) => state.isModalOpen);
  const setIsModalOpen = useConfirmModal((state) => state.setIsModalOpen);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = (data) => {
    if (data.password === 'Semarang@2025') {
      toast.promise(deleteTask(selectedTaskId), {
        loading: 'Sedang menghapus task...',
        success: () => {
          form.reset();
          setIsModalOpen(false);
          return 'Task berhasil dihapus';
        },
        error: (err) => {
          // err adalah error yang dilempar dari store
          return err.message || 'Gagal menghapus task';
        },
      });
    } else {
      toast.error('Password salah!');
      form.setValue('password', '');
    }
  };

  const onClose = () => {
    form.setValue('password', '');
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
          <Form {...form}>
            <form
              id="deleteTask"
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-1 space-y-6"
            >
              {/* Input Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1">
                      Masukkan Password<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="off" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Button Modal */}
              <div className="w-full flex justify-end gap-2">
                <Button
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={onClose}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="cursor-pointer text-white bg-red-600 hover:bg-red-700"
                >
                  Hapus
                </Button>
              </div>
            </form>
          </Form>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
