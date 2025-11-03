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
import { useAddActivity } from '@/api/addActivity';

const formSchema = z.object({
  activity: z.string().trim().min(1, 'Mohon tuliskan nama activity.'),
});

export default function AddActivityForm() {
  const { mutateAsync: addActivityMutation, isPending } = useAddActivity();
  // Close Modal
  const setIsModalOpen = useFormModal((state) => state.setIsModalOpen);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activity: '',
    },
  });

  const onSubmit = (data) => {
    toast.promise(addActivityMutation(data.activity), {
      loading: () => {
        return 'Sedang menambahkan activity...';
      },
      success: () => {
        form.reset(); // reset form setelah submit
        setIsModalOpen(false);
        return `"${data.activity}" telah ditambahkan ke daftar activity`;
      },
      error: (err) => {
        // err adalah error yang dilempar dari store
        return err.message || 'Gagal menambahkan activity';
      },
    });
  };

  return (
    <>
      <form id="add-activity" onSubmit={form.handleSubmit(onSubmit)}>
        <Controller
          name="activity"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="add-activity-activity" className="gap-0.5">
                Nama Activity<span className="text-red-500">*</span>
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
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary" disabled={isPending}>
            Batal
          </Button>
        </DialogClose>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
          type="submit"
          form="add-activity"
          disabled={isPending}
        >
          {isPending && <Spinner />}
          {isPending ? 'Mengirim...' : 'Tambah'}
        </Button>
      </DialogFooter>
    </>
  );
}
