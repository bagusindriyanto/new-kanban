import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { FieldGroup, FieldSeparator, FieldSet } from '@/components/ui/field';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';

import { useFetchUsers } from '@/features/users/api/fetchUsers';
import { useUpdateTask } from '@/features/tasks/api/updateTask';
import { formatToSQL } from '@/utils/formatTimestamp';

import SwitchField from '@/components/shared/form/SwitchField';
import TextareaField from '@/components/shared/form/TextareaField';
import ComboboxField from '@/components/shared/form/ComboboxField';
import SelectField from '@/components/shared/form/SelectField';
import DateTimeField from '@/components/shared/form/DateTimeField';
import NumberInputField from '@/components/shared/form/NumberInputField';
import useAuthStore from '@/stores/authStore';
import useModalStore from '@/stores/modalStore';
import ActivitiesCombobox from '@/features/activities/components/ActivitiesCombobox';

const statusItems = [
  { value: 'todo', label: 'To Do' },
  { value: 'on progress', label: 'On Progress' },
  { value: 'done', label: 'Done' },
];

const baseSchema = z.object({
  content: z.string().min(1, 'Mohon pilih salah satu aktivitas.'),
  user_id: z.string().min(1, 'Mohon pilih PIC.'),
  status: z.enum(['todo', 'on progress', 'done'], {
    error: 'Status harus dipilih.',
  }),
  minute_pause: z.number().nonnegative('Durasi pause harus 0 atau lebih.'),
  pause_time: z.boolean(),
  detail: z.coerce
    .string()
    .max(100, 'Detail tidak boleh lebih dari 100 karakter.')
    .trim()
    .optional(),
  timestamp_todo: z.date('Mohon isi tanggal dan waktu.'),
  timestamp_progress: z.date('Mohon isi tanggal dan waktu.').nullish(),
  timestamp_done: z.date('Mohon isi tanggal dan waktu.').nullish(),
  is_scheduled: z.boolean(),
  scheduled_at: z.date().nullish(),
});

const formSchema = baseSchema.superRefine((data, ctx) => {
  if (data.is_scheduled && !data.scheduled_at) {
    ctx.addIssue({
      code: 'no_scheduled_at',
      message: 'Mohon isi tanggal dan waktu.',
      path: ['scheduled_at'],
    });
  }
});

const submitSchema = baseSchema
  .omit({
    is_scheduled: true,
  })
  .extend({
    id: z.number(),
    assigner_id: z.string().nullish(),
  })
  .transform((data) => ({
    ...data,
    detail: data.detail || null,
    minute_activity:
      data.timestamp_progress && data.timestamp_done
        ? Math.floor((data.timestamp_done - data.timestamp_progress) / 60000) -
          data.minute_pause
        : 0,
    pause_time: data.pause_time ? formatToSQL(new Date()) : null,
    timestamp_todo: formatToSQL(data.timestamp_todo),
    timestamp_progress: formatToSQL(data.timestamp_progress),
    timestamp_done: formatToSQL(data.timestamp_done),
    scheduled_at: formatToSQL(data.scheduled_at),
    updated_at: formatToSQL(new Date()),
  }));

const UpdateTaskForm = () => {
  // Fetch data
  const { data: users } = useFetchUsers();

  // State untuk tasks yang dipilih
  const setUpdateOpen = useModalStore((state) => state.setUpdateOpen);
  const selectedTask = useModalStore((state) => state.selectedTask);

  // Update Tasks
  const { mutateAsync: updateTaskMutate, isPending } = useUpdateTask();

  // State user yang login saat ini
  const currentUser = useAuthStore((state) => state.currentUser);

  // Set nilai awal form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: selectedTask?.content ?? '',
      user_id: selectedTask?.user_id ?? null,
      status: selectedTask?.status ?? undefined,
      minute_pause: selectedTask?.minute_pause ?? 0,
      pause_time: !!selectedTask?.pause_time,
      detail: selectedTask?.detail ?? '',
      timestamp_todo: selectedTask?.timestamp_todo
        ? new Date(selectedTask.timestamp_todo)
        : undefined,
      timestamp_progress: selectedTask?.timestamp_progress
        ? new Date(selectedTask.timestamp_progress)
        : undefined,
      timestamp_done: selectedTask?.timestamp_done
        ? new Date(selectedTask.timestamp_done)
        : undefined,
      is_scheduled: !!selectedTask?.scheduled_at,
      scheduled_at: selectedTask?.scheduled_at
        ? new Date(selectedTask.scheduled_at)
        : undefined,
    },
  });

  // Cek input status untuk disable timestamp
  const statusInput = form.watch('status');
  const isScheduled = form.watch('is_scheduled');

  // Reset value timestamp
  switch (statusInput) {
    case 'todo':
      form.setValue('pause_time', false);
      form.setValue('minute_pause', 0);
      form.setValue('timestamp_progress', undefined);
      form.setValue('timestamp_done', undefined);
      break;
    case 'on progress':
      form.setValue('timestamp_done', undefined);
      break;
    case 'done':
      form.setValue('pause_time', false);
      break;
  }

  // Submit form
  const onSubmit = (data) => {
    const payload = submitSchema.parse({
      ...data,
      id: selectedTask.id,
      assigner_id: data.user_id === currentUser.id ? null : currentUser.id,
    });

    toast.promise(updateTaskMutate(payload), {
      loading: 'Sedang memperbarui task...',
      success: () => {
        form.reset();
        setUpdateOpen(false);
        return 'Task berhasil diperbarui';
      },
      error: (err) => {
        return {
          message: 'Task gagal diperbarui',
          description: err?.message || null,
        };
      },
    });
  };

  // Form
  return (
    <>
      <div className="max-h-[60vh] overflow-y-auto -mx-4 px-4 pb-2">
        <form id="update-task" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card mt-1">
              Aktivitas & PIC
            </FieldSeparator>
            <FieldGroup className="grid grid-cols-2 gap-4">
              {/* Activity */}
              <ActivitiesCombobox control={form.control} />
              {/* PIC Combo Box */}
              <ComboboxField
                name="user_id"
                control={form.control}
                label="PIC"
                required
                items={users}
                valueKey="user_id"
                labelKey="name"
                placeholder="Pilih PIC"
              />
            </FieldGroup>
            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card mt-2">
              Status & Waktu
            </FieldSeparator>
            <FieldGroup className="grid grid-cols-2 gap-4">
              {/* Status */}
              <SelectField
                name="status"
                control={form.control}
                label="Status"
                required
                items={statusItems}
                valueKey="value"
                labelKey="label"
                placeholder="Pilih status task"
              />
              {/* Timestamp Todo */}
              <DateTimeField
                name="timestamp_todo"
                control={form.control}
                label="Timestamp To Do"
                required
                side="right"
              />
              {/* Timestamp On Progress */}
              <DateTimeField
                name="timestamp_progress"
                control={form.control}
                label="Timestamp On Progress"
                required={statusInput !== 'todo'}
                disabled={statusInput === 'todo'}
              />
              {/* Timestamp Done */}
              <DateTimeField
                name="timestamp_done"
                control={form.control}
                label="Timestamp Done"
                required={statusInput === 'done'}
                disabled={statusInput !== 'done'}
                side="right"
              />
            </FieldGroup>
            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card mt-2">
              Kondisi Pause
            </FieldSeparator>
            <FieldGroup className="grid grid-cols-2 gap-4">
              {/* Pause Time */}
              <SwitchField
                name="pause_time"
                control={form.control}
                label="Pause aktivitas sekarang?"
                disabled={statusInput !== 'on progress'}
              />
              {/* Minute Pause */}
              <NumberInputField
                name="minute_pause"
                control={form.control}
                label="Durasi Pause (menit)"
                min={0}
                disabled={statusInput === 'todo'}
              />
            </FieldGroup>
            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card mt-2">
              Jadwal
            </FieldSeparator>
            <FieldGroup className="grid grid-cols-2 gap-4 min-h-[68px]">
              {/* Appointment Switch */}
              <SwitchField
                name="is_scheduled"
                control={form.control}
                label="Jadwalkan Task?"
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
            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card mt-2">
              Detail
            </FieldSeparator>
            <FieldGroup>
              {/* Detail */}
              <TextareaField
                name="detail"
                control={form.control}
                label="Detail"
                placeholder="Detail task"
              />
            </FieldGroup>
          </FieldSet>
        </form>
      </div>
      <DialogFooter>
        <DialogClose render={<Button variant="outline" disabled={isPending} />}>
          Batal
        </DialogClose>
        <Button type="submit" form="update-task" disabled={isPending}>
          {isPending && <Spinner data-icon="inline-start" />}
          {isPending ? 'Memperbarui...' : 'Edit'}
        </Button>
      </DialogFooter>
    </>
  );
};

export default UpdateTaskForm;
