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

const FormSchema = z.object({
  pic: z.string().trim().nonempty({ message: 'Mohon tuliskan nama PIC.' }),
});

export default function PICForm() {
  const addPic = usePics((state) => state.addPic);
  const error = usePics((state) => state.error);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pic: '',
    },
  });

  const onSubmit = async (data) => {
    await toast.promise(addPic(data.pic), {
      loading: 'Sedang mengirim...',
      success: `'${data.pic}' telah ditambahkan ke daftar PIC`,
      error: `Error: ${error}`,
    });
    form.reset(); // reset form setelah submit
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
              <FormLabel>Nama PIC</FormLabel>
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
