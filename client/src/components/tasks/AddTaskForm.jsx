import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Trash2Icon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useFetchActivities } from '@/api/fetchActivities';
import { useFetchPICs } from '@/api/fetchPICs';
import { Switch } from '../ui/switch';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { TimePickerDemo } from '../ui/time-picker-demo';
import useAuth from '@/stores/authStore';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '../ui/input-group';
import { formatToSQL } from '@/utils/formatTimestamp';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import TextareaField from '../shared/form/TextareaField';
import SwitchField from '../shared/form/SwitchField';
import DateTimeField from '../shared/form/DateTimeField';

const formSchema = z
  .object({
    content: z.string().min(1, 'Mohon pilih salah satu aktivitas.'),
    pic_id: z.number().nullish(),
    detail: z
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
    if (data.is_assigned && !data.pic_id) {
      ctx.addIssue({
        code: 'no_pic_id',
        message: 'Mohon pilih PIC.',
        path: ['pic_id'],
      });
    }
  })
  .transform((data) => ({
    ...data,
    status: 'todo',
    timestamp_todo: formatToSQL(new Date()),
    timestamp_progress: null,
    timestamp_done: null,
    timestamp_archived: null,
    minute_pause: 0,
    minute_activity: 0,
    pause_time: null,
    scheduled_at: data.is_scheduled ? formatToSQL(data.scheduled_at) : null,
  }));

const AddTaskForm = ({ mutateAsync, onOpenChange }) => {
  // Fetch Data
  const { data: contents } = useFetchActivities();
  const { data: pics } = useFetchPICs();

  const user = useAuth((state) => state.user);
  const filteredPics = pics?.filter((pic) => pic.id !== user.id);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
      pic_id: null,
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
      pic_id: isAssigned ? data.pic_id : user.id,
      assigner_id: isAssigned ? user.id : null,
      pic_name: isAssigned
        ? filteredPics?.find((pic) => pic.id === data.pic_id)?.name
        : user.name,
    };

    toast.promise(mutateAsync(payload), {
      loading: 'Sedang menambahkan task...',
      success: () => {
        form.reset();
        onOpenChange(false);
        return 'Task berhasil ditambahkan.';
      },
      error: (err) => {
        return {
          message:
            err.response?.data?.message ||
            err.message ||
            'Gagal menambahkan task.',
          description: err.response?.data?.error_detail || null,
        };
      },
    });
  };

  return (
    <form id="add-task" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldGroup>
          {/* Activity */}
          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="add-task-content" className="gap-0.5">
                  Aktivitas<span className="text-red-500">*</span>
                </FieldLabel>
                <Combobox
                  autoHighlight
                  items={contents}
                  itemToStringLabel={(content) => content.name}
                  itemToStringValue={(content) => content.name}
                  value={
                    contents?.find((content) => content.name === field.value) ??
                    null
                  }
                  onValueChange={(content) => {
                    field.onChange(content?.name ?? '');
                  }}
                >
                  <ComboboxInput
                    id="add-task-content"
                    aria-invalid={fieldState.invalid}
                    placeholder="Pilih aktivitas"
                    showClear
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>Aktivitas tidak ditemukan.</ComboboxEmpty>
                    <ComboboxList>
                      {(content) => (
                        <ComboboxItem key={content.id} value={content}>
                          {content.name}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
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
          <Controller
            name="pic_id"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="add-task-pic" className="gap-0.5">
                  Tugaskan ke:{' '}
                  <span
                    className={cn('text-red-500', {
                      hidden: !isAssigned,
                    })}
                  >
                    *
                  </span>
                </FieldLabel>
                <Combobox
                  autoHighlight
                  items={filteredPics}
                  itemToStringLabel={(pic) => pic.name}
                  itemToStringValue={(pic) => pic.id}
                  value={
                    filteredPics?.find((pic) => pic.id === field.value) ?? null
                  }
                  onValueChange={(pic) => {
                    field.onChange(pic?.id ?? null);
                  }}
                  disabled={!isAssigned}
                >
                  <ComboboxInput
                    id="add-task-pic"
                    aria-invalid={fieldState.invalid}
                    placeholder="Pilih PIC"
                    showClear
                    disabled={!isAssigned}
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>PIC tidak ditemukan.</ComboboxEmpty>
                    <ComboboxList>
                      {(pic) => (
                        <ComboboxItem key={pic.id} value={pic}>
                          {pic.name}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
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
            isRequired={isScheduled}
            side="right"
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
  );
};

export default AddTaskForm;
