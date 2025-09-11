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
import useActivities from '@/stores/activityStore';
import useFormModal from '@/stores/formModalStore';

const FormSchema = z.object({
  activity: z
    .string()
    .trim()
    .nonempty({ message: 'Mohon tuliskan nama activity.' }),
});

export default function AddActivityForm() {
  const addActivity = useActivities((state) => state.addActivity);
  const error = useActivities((state) => state.error);
  // Close Modal
  const setIsModalOpen = useFormModal((state) => state.setIsModalOpen);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      activity: '',
    },
  });

  const onSubmit = (data) => {
    toast.promise(addActivity(data.activity), {
      loading: 'Sedang menambahkan activity...',
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
    <Form {...form}>
      <form
        id="addActivity"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Input Activity */}
        <FormField
          control={form.control}
          name="activity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Activity</FormLabel>
              <FormControl>
                <Input
                  placeholder="contoh: Meeting, Review, dan sebagainya"
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
