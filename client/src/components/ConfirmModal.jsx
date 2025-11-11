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

const formSchema = z.object({
  password: z.string().min(1, 'Mohon isi password.'),
});

const ConfirmModal = () => {
  const selectedTaskId = useFilter((state) => state.selectedTaskId);
  const { mutateAsync: deleteTaskMutation, isPending } = useDeleteTask();
  const isModalOpen = useConfirmModal((state) => state.isModalOpen);
  const setIsModalOpen = useConfirmModal((state) => state.setIsModalOpen);
  // Tampilkan Password/Tidak
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = (data) => {
    if (data.password === 'Semarang@2025') {
      toast.promise(deleteTaskMutation(selectedTaskId), {
        loading: () => {
          return 'Sedang menghapus task...';
        },
        success: () => {
          form.reset();
          setIsModalOpen(false);
          return 'Task berhasil dihapus.';
        },
        error: (err) => {
          // err adalah error yang dilempar dari store
          return {
            message:
              err.response?.data?.message ||
              err.message ||
              'Gagal menghapus task.',
            description: err.response?.data?.error_detail || null,
          };
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
            disabled={isPending}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="danger"
            form="delete-task"
            disabled={isPending}
          >
            {isPending && <Spinner />}
            {isPending ? 'Menghapus...' : 'Hapus'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmModal;
