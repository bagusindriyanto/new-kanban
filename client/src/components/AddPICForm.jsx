import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import useFormModal from '@/stores/formModalStore';
import { useAddPic } from '@/api/addPic';

const FormSchema = z.object({
  pic: z.string().trim().min(1, 'Mohon tuliskan nama PIC.'),
});

export default function AddPICForm() {
  const { mutateAsync: addPicMutation } = useAddPic();
  // Close Modal
  const setIsModalOpen = useFormModal((state) => state.setIsModalOpen);
  // Proses Kirim Data
  const setIsLoading = useFormModal((state) => state.setIsLoading);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pic: '',
    },
  });

  const onSubmit = (data) => {
    toast.promise(addPicMutation(data.pic), {
      loading: () => {
        setIsLoading(true);
        return 'Sedang menambahkan PIC...';
      },
      success: () => {
        form.reset(); // reset form setelah submit
        setIsModalOpen(false);
        setIsLoading(false);
        return `"${data.pic}" telah ditambahkan ke daftar PIC`;
      },
      error: (err) => {
        setIsLoading(false);
        // err adalah error yang dilempar dari store
        return err.message || 'Gagal menambahkan PIC';
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
}
