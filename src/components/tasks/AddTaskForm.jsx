import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { FieldGroup, FieldSet } from '@/components/ui/field';
import { useFetchProfiles } from '@/api/fetchProfiles';
import useAuthStore from '@/stores/authStore';
import { formatToSQL } from '@/utils/formatTimestamp';
import TextareaField from '../shared/form/TextareaField';
import SwitchField from '../shared/form/SwitchField';
import DateTimeField from '../shared/form/DateTimeField';
import ComboboxField from '../shared/form/ComboboxField';
import ActivityCombobox from '../activity/ActivityCombobox';
import { useAddTask } from '@/api/addTask';
import { DialogClose, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';

const formSchema = z
  .object({
    content: z.string().min(1, 'Mohon pilih salah satu aktivitas.'),
    user_id: z.number().nullish(),
    detail: z.coerce
      .string()
      .max(100, 'Detail tidak boleh lebih dari 100 karakter.')
      .trim()
      .optional(),
    is_scheduled: z.boolean(),
    is_assigned: z.boolean(),
    scheduled_at: z.date().nullish(),
  })
  .superRefine((data, ctx) => {
    if (data.is_scheduled && !data.scheduled_at) {
      ctx.addIssue({
        code: 'no_scheduled_at',
        message: 'Mohon isi tanggal dan waktu.',
        path: ['scheduled_at'],
      });
    }
    if (data.is_assigned && !data.user_id) {
      ctx.addIssue({
        code: 'no_user_id',
        message: 'Mohon pilih PIC.',
        path: ['user_id'],
      });
    }
  })
  .transform((data) => ({
    ...data,
    status: 'todo',
    timestamp_todo: formatToSQL(new Date()),
    timestamp_progress: null,
    timestamp_done: null,
    minute_pause: 0,
    minute_activity: 0,
    pause_time: null,
    scheduled_at: formatToSQL(data.scheduled_at),
  }));

const AddTaskForm = ({ onOpenChange }) => {
  // Fetch Data
  const { data: profiles } = useFetchProfiles();
  const { mutateAsync: addTaskMutation, isPending } = useAddTask();

  const user = useAuthStore((state) => state.user);
  const filteredProfiles = profiles?.filter(
    (profile) => profile.user_id !== user.id,
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
      user_id: null,
      detail: '',
      is_scheduled: false,
      is_assigned: false,
      scheduled_at: undefined,
    },
  });

  const isScheduled = form.watch('is_scheduled');
  const isAssigned = form.watch('is_assigned');

  const onSubmit = (data) => {
    const payload = {
      ...data,
      user_id: isAssigned ? data.user_id : user.id,
      assigner_id: isAssigned ? user.id : null,
    };

    toast.promise(addTaskMutation(payload), {
      loading: 'Sedang menambahkan task...',
      success: () => {
        form.reset();
        onOpenChange(false);
        return 'Task berhasil ditambahkan';
      },
      error: (err) => {
        return {
          message: 'Task gagal ditambahkan',
          description: err.response?.data?.message || null,
        };
      },
    });
  };

  return (
    <>
      <form id="add-task" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldSet>
          <FieldGroup>
            {/* Activity */}
            <ActivityCombobox control={form.control} />
          </FieldGroup>

          <FieldGroup className="grid grid-cols-2 gap-4 min-h-[68px]">
            {/* Assigned Switch */}
            <SwitchField
              name="is_assigned"
              control={form.control}
              label="Tugaskan Task?"
              className="mt-6"
            />
            {/* PIC Combo Box */}
            <ComboboxField
              name="user_id"
              control={form.control}
              label="Tugaskan ke"
              required={isAssigned}
              disabled={!isAssigned}
              items={filteredProfiles}
              valueKey="user_id"
              labelKey="name"
              placeholder="Pilih PIC"
            />
          </FieldGroup>

          <FieldGroup className="grid grid-cols-2 gap-4 min-h-[68px]">
            {/* Appointment Switch */}
            <SwitchField
              name="is_scheduled"
              control={form.control}
              label="Jadwalkan Task?"
              className="mt-6"
            />
            {/* Appointment Date */}
            <DateTimeField
              name="scheduled_at"
              control={form.control}
              label="Tanggal & Waktu Jadwal"
              required={isScheduled}
              disabled={!isScheduled}
              side="right"
              disabledDate="before"
            />
          </FieldGroup>
          {/* Detail */}
          <FieldGroup>
            <TextareaField
              name="detail"
              control={form.control}
              label="Detail"
              placeholder="Detail task"
            />
          </FieldGroup>
        </FieldSet>
      </form>
      <DialogFooter>
        <DialogClose render={<Button variant="outline" disabled={isPending} />}>
          Batal
        </DialogClose>
        <Button type="submit" form="add-task" disabled={isPending}>
          {isPending && <Spinner data-icon="inline-start" />}
          {isPending ? 'Menambahkan...' : 'Tambah'}
        </Button>
      </DialogFooter>
    </>
  );
};

export default AddTaskForm;
