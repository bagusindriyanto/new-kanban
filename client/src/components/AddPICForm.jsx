import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

const formSchema = z.object({
  pic: z.string().trim().min(1, 'Mohon tuliskan nama PIC.'),
});

const AddPICForm = ({ mutateAsync, onOpenChange }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pic: '',
    },
  });

  const onSubmit = (data) => {
    toast.promise(mutateAsync(data), {
      loading: () => {
        return 'Sedang menambahkan PIC...';
      },
      success: () => {
        form.reset();
        onOpenChange(false);
        return `"${data.pic}" telah ditambahkan ke daftar PIC.`;
      },
      error: (err) => {
        return {
          message:
            err.response?.data?.message ||
            err.message ||
            'Gagal menambahkan PIC.',
          description: err.response?.data?.error_detail || null,
        };
      },
    });
  };

  return (
    <form id="add-pic" onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        name="pic"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="add-pic-pic" className="gap-0.5">
              Nama PIC<span className="text-red-500">*</span>
            </FieldLabel>
            <Input
              {...field}
              id="add-pic-pic"
              aria-invalid={fieldState.invalid}
              placeholder="contoh: Bagus"
              autoComplete="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </form>
  );
};

export default AddPICForm;
