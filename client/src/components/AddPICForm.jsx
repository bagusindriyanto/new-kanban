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
import usePics from '@/stores/picStore';
import useFormModal from '@/stores/formModalStore';

const FormSchema = z.object({
  pic: z.string().trim().nonempty({ message: 'Mohon tuliskan nama PIC.' }),
});

export default function AddPICForm() {
  const addPic = usePics((state) => state.addPic);
  // Close Modal
  const setIsModalOpen = useFormModal((state) => state.setIsModalOpen);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pic: '',
    },
  });

  const onSubmit = (data) => {
    toast.promise(addPic(data.pic), {
      loading: 'Sedang menambahkan PIC...',
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
