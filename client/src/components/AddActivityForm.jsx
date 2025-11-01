import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import useFormModal from '@/stores/formModalStore';
import { useAddActivity } from '@/api/addActivity';

const formSchema = z.object({
  activity: z.string().trim().min(1, 'Mohon tuliskan nama activity.'),
});

export default function AddActivityForm() {
  const { mutateAsync: addActivityMutation } = useAddActivity();
  // Close Modal
  const setIsModalOpen = useFormModal((state) => state.setIsModalOpen);
  // Proses Kirim Data
  const setIsLoading = useFormModal((state) => state.setIsLoading);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activity: '',
    },
  });

  const onSubmit = (data) => {
    toast.promise(addActivityMutation(data.activity), {
      loading: () => {
        setIsLoading(true);
        return 'Sedang menambahkan activity...';
      },
      success: () => {
        form.reset(); // reset form setelah submit
        setIsModalOpen(false);
        setIsLoading(false);
        return `"${data.activity}" telah ditambahkan ke daftar activity`;
      },
      error: (err) => {
        setIsLoading(false);
        // err adalah error yang dilempar dari store
        return err.message || 'Gagal menambahkan activity';
      },
    });
  };

  return (
    <form id="add-activity" onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        name="activity"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="add-activity-activity">
              Nama Activity
            </FieldLabel>
            <Input
              {...field}
              id="add-activity-activity"
              aria-invalid={fieldState.invalid}
              placeholder="contoh: Meeting, Review, dan sebagainya"
              autoComplete="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </form>
  );
}
