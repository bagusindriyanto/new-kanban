import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import useFormModal from '@/stores/formModalStore';
import { useAddPic } from '@/api/addPic';

const FormSchema = z.object({
  pic: z.string().trim().min(1, 'Mohon tuliskan nama PIC.'),
});

export default function AddPICForm() {
  const { mutateAsync: addPicMutation, isPending } = useAddPic();
  // Close Modal
  const setIsModalOpen = useFormModal((state) => state.setIsModalOpen);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pic: '',
    },
  });

  const onSubmit = (data) => {
    toast.promise(addPicMutation(data.pic), {
      loading: () => {
        return 'Sedang menambahkan PIC...';
      },
      success: () => {
        form.reset(); // reset form setelah submit
        setIsModalOpen(false);
        return `"${data.pic}" telah ditambahkan ke daftar PIC`;
      },
      error: (err) => {
        // err adalah error yang dilempar dari store
        return err.message || 'Gagal menambahkan PIC';
      },
    });
  };

  return (
    <>
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
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary" disabled={isPending}>
            Batal
          </Button>
        </DialogClose>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
          type="submit"
          form="add-pic"
          disabled={isPending}
        >
          {isPending && <Spinner />}
          {isPending ? 'Mengirim...' : 'Tambah'}
        </Button>
      </DialogFooter>
    </>
  );
}
