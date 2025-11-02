import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import useFormModal from '@/stores/formModalStore';
import useConfirmModal from '@/stores/confirmModalStore';
import useFilter from '@/stores/filterStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Eye, EyeClosed } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { useDeleteTask } from '@/api/deleteTask';
import { useState } from 'react';

const FormSchema = z.object({
  password: z.string().nonempty({ message: 'Mohon isi password.' }),
});

export default function ConfirmModal() {
  const selectedTaskId = useFilter((state) => state.selectedTaskId);
  const { mutateAsync: deleteTaskMutation } = useDeleteTask();
  const isModalOpen = useConfirmModal((state) => state.isModalOpen);
  const setIsModalOpen = useConfirmModal((state) => state.setIsModalOpen);
  // Proses Kirim Data
  const isLoading = useFormModal((state) => state.isLoading);
  const setIsLoading = useFormModal((state) => state.setIsLoading);
  // Tampilkan Password/Tidak
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = (data) => {
    if (data.password === 'Semarang@2025') {
      toast.promise(deleteTaskMutation(selectedTaskId), {
        loading: () => {
          setIsLoading(true);
          return 'Sedang menghapus task...';
        },
        success: () => {
          form.reset();
          setIsModalOpen(false);
          setIsLoading(false);
          return 'Task berhasil dihapus';
        },
        error: (err) => {
          setIsLoading(false);
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
    form.reset();
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
        <form id="delete-task" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="delete-task-password" className="gap-0.5">
                  Masukkan Password<span className="text-red-500">*</span>
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    id="delete-task-password"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      onMouseDown={() => setShowPassword(true)}
                      onMouseUp={() => setShowPassword(false)}
                    >
                      {showPassword ? <EyeClosed /> : <Eye />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </form>
        {/* Button Modal */}
        <AlertDialogFooter>
          <Button
            type="button"
            variant="secondary"
            className="cursor-pointer"
            onClick={onClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            form="delete-task"
            className="cursor-pointer text-white bg-red-600 hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading && <Spinner />}
            {isLoading ? 'Menghapus...' : 'Hapus'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
