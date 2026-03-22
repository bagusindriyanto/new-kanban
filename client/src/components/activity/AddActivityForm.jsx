import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import InputField from '../shared/form/InputField';

const formSchema = z.object({
  activity: z.string().min(1, 'Mohon tuliskan nama aktivitas.').trim(),
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
      loading: 'Sedang menambahkan aktivitas...',
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
      <InputField
        name="activity"
        control={form.control}
        label="Nama Aktivitas"
        required
        placeholder="contoh: Meeting, Review, dan sebagainya"
        autoComplete="off"
      />
    </form>
  );
};

export default AddActivityForm;
