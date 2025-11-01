import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Input } from '@/components/ui/input';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import useFormModal from '@/stores/formModalStore';
import { useAddPic } from '@/api/addPic';

const FormSchema = z.object({
  pic: z.string().trim().nonempty({ message: 'Mohon tuliskan nama PIC.' }),
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
    <Form {...form}>
      <form
        id="addPic"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Input PIC */}
        <FormField
          control={form.control}
          name="pic"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="gap-1">
                Nama PIC<span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="contoh: Bagus"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
