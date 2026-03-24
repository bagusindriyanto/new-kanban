import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { FieldGroup, FieldSet } from '@/components/ui/field';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import useFilter from '@/stores/filterStore';
import useUpdateTaskModal from '@/stores/updateTaskModalStore';

import { useFetchActivities } from '@/api/fetchActivities';
import { useFetchPics } from '@/api/fetchPics';
import { useUpdateTask } from '@/api/updateTask';
import { useFetchTasks } from '@/api/fetchTasks';
import { ScrollArea } from '../ui/scroll-area';
import useTaskFilters from '@/hooks/useTaskFilters';
import useAuth from '@/stores/authStore';
import { formatToSQL } from '@/utils/formatTimestamp';

import SwitchField from '../shared/form/SwitchField';
import TextareaField from '../shared/form/TextareaField';
import ComboboxField from '../shared/form/ComboboxField';
import SelectField from '../shared/form/SelectField';
import DateTimeField from '../shared/form/DateTimeField';
import NumberInputField from '../shared/form/NumberInputField';

const statusItems = [
  { value: 'todo', label: 'To Do' },
  { value: 'on progress', label: 'On Progress' },
  { value: 'pending', label: 'Pending' },
  { value: 'done', label: 'Done' },
];

const formSchema = z
  .object({
    content: z.string().min(1, 'Mohon pilih salah satu aktivitas.'),
    pic_id: z.number('Mohon pilih PIC.'),
    status: z.enum(['todo', 'on progress', 'pending', 'done'], {
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
    timestamp_pending: z.date('Mohon isi tanggal dan waktu.').nullish(),
    timestamp_done: z.date('Mohon isi tanggal dan waktu.').nullish(),
    is_scheduled: z.boolean(),
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
  })
  .transform((data) => ({
    ...data,
    minute_activity:
      data.timestamp_progress && data.timestamp_pending
        ? Math.floor(
            (data.timestamp_pending - data.timestamp_progress) / 60000,
          ) - data.minute_pause
        : 0,
    pause_time: data.pause_time ? formatToSQL(new Date()) : null,
    timestamp_todo: formatToSQL(data.timestamp_todo),
    timestamp_progress: data.timestamp_progress
      ? formatToSQL(data.timestamp_progress)
      : null,
    timestamp_pending: data.timestamp_pending
      ? formatToSQL(data.timestamp_pending)
      : null,
    timestamp_done: data.timestamp_done
      ? formatToSQL(data.timestamp_done)
      : null,
    scheduled_at: data.is_scheduled ? formatToSQL(data.scheduled_at) : null,
  }));

const UpdateTaskForm = () => {
  // Custom hook untuk logic filter
  const { queryParams } = useTaskFilters();
  // Fetch data
  const { data: contents } = useFetchActivities();
  const { data: pics } = useFetchPics();
  const { data: tasks } = useFetchTasks(queryParams);

  const user = useAuth((state) => state.user);
  const filteredPics = pics?.filter((pic) => pic.id !== user.id);

  // State untuk tasks yang dipilih
  const selectedTaskId = useFilter((state) => state.selectedTaskId);
  const task = tasks?.find((task) => task.id === selectedTaskId);

  // Update Tasks
  const { mutateAsync: updateTaskMutate, isPending } = useUpdateTask();

  // Close Modal
  const setIsModalOpen = useUpdateTaskModal((state) => state.setIsModalOpen);

  // Set nilai awal form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: task?.content ?? '',
      pic_id: task?.pic_id ?? null,
      status: task?.status ?? undefined,
      minute_pause: task?.minute_pause ?? 0,
      pause_time: !!task?.pause_time,
      detail: task?.detail ?? '',
      timestamp_todo: task?.timestamp_todo
        ? new Date(task.timestamp_todo)
        : undefined,
      timestamp_progress: task?.timestamp_progress
        ? new Date(task.timestamp_progress)
        : undefined,
      timestamp_pending: task?.timestamp_pending
        ? new Date(task.timestamp_pending)
        : undefined,
      timestamp_done: task?.timestamp_done
        ? new Date(task.timestamp_done)
        : undefined,
      is_scheduled: !!task?.scheduled_at,
      scheduled_at: task?.scheduled_at
        ? new Date(task.scheduled_at)
        : undefined,
    },
  });

  // Cek input status untuk disable timestamp
  const statusInput = form.watch('status');
  const isScheduled = form.watch('is_scheduled');

  // Reset value timestamp
  switch (statusInput) {
    case 'todo':
      form.setValue('timestamp_progress', undefined);
      form.setValue('timestamp_pending', undefined);
      form.setValue('timestamp_done', undefined);
      break;
    case 'on progress':
      form.setValue('timestamp_pending', undefined);
      form.setValue('timestamp_done', undefined);
      break;
    case 'pending':
      form.setValue('timestamp_done', undefined);
      break;
  }

  // Submit form
  const onSubmit = (data) => {
    const payload = {
      ...data,
      id: selectedTaskId,
      pic_name: pics?.find((pic) => pic.id === data.pic_id)?.name,
    };

    toast.promise(updateTaskMutate(payload), {
      loading: 'Sedang memperbarui task...',
      success: () => {
        form.reset();
        setIsModalOpen(false);
        return 'Task berhasil diperbarui.';
      },
      error: (err) => {
        return {
          message:
            err.response?.data?.message ||
            err.message ||
            'Gagal memperbarui task.',
          description: err.response?.data?.error_detail || null,
        };
      },
    });
  };

  // Form
  return (
    <>
      <ScrollArea className="-mx-4 px-4 max-h-[60vh]">
        <form id="update-task" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup className="grid grid-cols-2 gap-4">
              {/* Activity */}
              <ComboboxField
                name="content"
                control={form.control}
                label="Aktivitas"
                required
                items={contents}
                valueKey="name"
                labelKey="name"
                placeholder="Pilih aktivitas"
              />
              {/* PIC Combo Box */}
              <ComboboxField
                name="pic_id"
                control={form.control}
                label="PIC"
                required
                items={pics}
                valueKey="id"
                labelKey="name"
                placeholder="Pilih PIC"
              />
            </FieldGroup>

            <FieldGroup className="grid grid-cols-3 gap-4">
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
              {/* Minute Pause */}
              <NumberInputField
                name="minute_pause"
                control={form.control}
                label="Durasi Pause"
                min={0}
              />
              {/* Pause Time */}
              <SwitchField
                name="pause_time"
                control={form.control}
                label="Aktivitas di Pause?"
              />
            </FieldGroup>

            <FieldGroup className="grid grid-cols-2 gap-4">
              {/* Timestamp Todo */}
              <DateTimeField
                name="timestamp_todo"
                control={form.control}
                label="Timestamp To Do"
                required
              />
              {/* Timestamp On Progress */}
              <DateTimeField
                name="timestamp_progress"
                control={form.control}
                label="Timestamp On Progress"
                required={statusInput !== 'todo'}
                disabled={statusInput === 'todo'}
                side="right"
              />
              {/* Timestamp Pending */}
              <DateTimeField
                name="timestamp_pending"
                control={form.control}
                label="Timestamp Pending"
                required={
                  statusInput !== 'todo' && statusInput !== 'on progress'
                }
                disabled={
                  statusInput === 'todo' || statusInput === 'on progress'
                }
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
      </ScrollArea>
      <DialogFooter>
        <DialogClose render={<Button variant="outline" disabled={isPending} />}>
          Batal
        </DialogClose>
        <Button type="submit" form="update-task" disabled={isPending}>
          {isPending && <Spinner data-icon="inline-start" />}
          {isPending ? 'Mengirim...' : 'Edit'}
        </Button>
      </DialogFooter>
    </>
  );
};

export default UpdateTaskForm;
