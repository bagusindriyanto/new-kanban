import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

const formSchema = z.object({
  activity: z.string().trim().min(1, 'Mohon tuliskan nama aktivitas.'),
});

const AddActivityForm = ({ mutateAsync, onOpenChange }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activity: '',
    },
  });

  const onSubmit = (data) => {
    toast.promise(mutateAsync(data), {
      loading: () => {
        return 'Sedang menambahkan aktivitas...';
      },
      success: () => {
        form.reset();
        onOpenChange(false);
        return `"${data.activity}" telah ditambahkan ke daftar aktivitas.`;
      },
      error: (err) => {
        return {
          message:
            err.response?.data?.message ||
            err.message ||
            'Gagal menambahkan aktivitas.',
          description: err.response?.data?.error_detail || null,
        };
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
            <FieldLabel htmlFor="add-activity-activity" className="gap-0.5">
              Nama Aktivitas<span className="text-red-500">*</span>
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
};

export default AddActivityForm;
