import { zodResolver } from '@hookform/resolvers/zod';
import {
  Check,
  ChevronsUpDown,
  Trash2Icon,
  CalendarIcon,
  Eye,
  EyeClosed,
} from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
} from '@/components/ui/input-group';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import useFilter from '@/stores/filterStore';
import useFormModal from '@/stores/formModalStore';

import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { id } from 'date-fns/locale';
import { TimePickerDemo } from './ui/time-picker-demo';
import { useState } from 'react';
import { useFetchActivities } from '@/api/fetchActivities';
import { useFetchPICs } from '@/api/fetchPICs';
import { useUpdateTask } from '@/api/updateTask';
import { useFetchTasks } from '@/api/fetchTasks';

// Aturan form
const formSchema = z.object({
  content: z.string('Activity harus dipilih.'),
  pic_id: z.number().nullish(),
  status: z.enum(['todo', 'on progress', 'done', 'archived'], {
    error: 'Status harus dipilih.',
  }),
  minute_pause: z.coerce
    .number()
    .min(0, 'Durasi pause harus 0 atau lebih.')
    .default(0),
  pause_time: z
    .boolean()
    .optional()
    .transform((val) => val ?? false),
  detail: z.string().trim().optional(),
  timestamp_todo: z.date('Mohon isi tanggal dan waktu.'),
  timestamp_progress: z.date('Mohon isi tanggal dan waktu.').nullish(),
  timestamp_done: z.date('Mohon isi tanggal dan waktu.').nullish(),
  timestamp_archived: z.date('Mohon isi tanggal dan waktu.').nullish(),
  password: z.string().min(1, 'Mohon isi password.'),
});

const NewUpdateTaskForm = () => {
  // State Buka/Tutup Popover
  const [activityOpen, setActivityOpen] = useState(false);
  const [picOpen, setPicOpen] = useState(false);
  // Tampilkan Password/Tidak
  const [showPassword, setShowPassword] = useState(false);
  // Fetch activity
  const { data: contents } = useFetchActivities();
  // Fetch pics
  const { data: pics } = useFetchPICs();
  // Fetch task yang dipilih
  const { data: tasks } = useFetchTasks();
  const selectedTaskId = useFilter((state) => state.selectedTaskId);
  const task = tasks?.filter((task) => task.id === selectedTaskId)[0];

  // Update Tasks
  const { mutateAsync: updateTaskMutate, isPending } = useUpdateTask();

  // Close Modal
  const setIsModalOpen = useFormModal((state) => state.setIsModalOpen);

  // Set nilai awal form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: task.content ?? undefined,
      pic_id: task.pic_id ?? undefined,
      status: task.status ?? undefined,
      minute_pause: task.minute_pause ?? undefined,
      pause_time: task.pause_time ? true : false,
      detail: task.detail ?? undefined,
      timestamp_todo: task.timestamp_todo
        ? new Date(task.timestamp_todo)
        : undefined,
      timestamp_progress: task.timestamp_progress
        ? new Date(task.timestamp_progress)
        : undefined,
      timestamp_done: task.timestamp_done
        ? new Date(task.timestamp_done)
        : undefined,
      timestamp_archived: task.timestamp_archived
        ? new Date(task.timestamp_archived)
        : undefined,
      password: '',
    },
  });

  // Cek input status untuk disable timestamp
  const statusInput = form.watch('status');

  // Reset value timestamp
  switch (statusInput) {
    case 'todo':
      form.setValue('timestamp_progress', undefined);
      form.setValue('timestamp_done', undefined);
      form.setValue('timestamp_archived', undefined);
      break;
    case 'on progress':
      form.setValue('timestamp_done', undefined);
      form.setValue('timestamp_archived', undefined);
      break;
    case 'done':
      form.setValue('timestamp_archived', undefined);
      break;
  }

  // Submit form
  const onSubmit = (data) => {
    // Cek password
    if (data.password === 'Semarang@2025') {
      // Hitung minute_activity
      const minute_activity =
        data.timestamp_progress && data.timestamp_done
          ? Math.floor(
              (data.timestamp_done - data.timestamp_progress) / 60000
            ) - data.minute_pause
          : 0;
      // Ubah timestamp ke ISOString
      const taskData = {
        ...data,
        minute_activity,
        pause_time: data.pause_time ? new Date().toISOString() : null,
        timestamp_todo: data.timestamp_todo.toISOString(),
        timestamp_progress: data.timestamp_progress
          ? data.timestamp_progress.toISOString()
          : null,
        timestamp_done: data.timestamp_done
          ? data.timestamp_done.toISOString()
          : null,
        timestamp_archived: data.timestamp_archived
          ? data.timestamp_archived.toISOString()
          : null,
      };

      toast.promise(
        updateTaskMutate({ taskId: selectedTaskId, data: taskData }),
        {
          loading: () => {
            return 'Sedang memperbarui task...';
          },
          success: () => {
            form.reset();
            setIsModalOpen(false);
            return 'Task berhasil diperbarui.';
          },
          error: (err) => {
            // err adalah error yang dilempar dari store
            return {
              message:
                err.response?.data?.message ||
                err.message ||
                'Gagal memperbarui task.',
              description: err.response?.data?.error_detail || null,
            };
          },
        }
      );
    } else {
      toast.error('Password salah!');
      form.setValue('password', '');
    }
  };

  // Form
  return (
    <>
      <form id="update-task-2" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-6 gap-4">
          {/* Activity */}
          <div className="col-span-3">
            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="update-task-content" className="gap-0.5">
                    Activity<span className="text-red-500">*</span>
                  </FieldLabel>
                  <Popover open={activityOpen} onOpenChange={setActivityOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        id="update-task-content"
                        aria-invalid={fieldState.invalid}
                        className={cn(
                          'w-full justify-between',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <span className="truncate">
                          {field.value
                            ? contents?.find(
                                (content) => content.name === field.value
                              )?.name
                            : 'Pilih activity'}
                        </span>
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="PopoverContent p-0">
                      <Command>
                        <CommandInput
                          placeholder="Cari activity..."
                          className="h-9"
                        />
                        <CommandList
                          onWheel={(e) => {
                            e.stopPropagation(); // Cegah event wheel menyebar ke Dialog
                          }}
                        >
                          <CommandEmpty>Activity tidak ditemukan.</CommandEmpty>
                          <CommandGroup>
                            {contents?.map((content) => (
                              <CommandItem
                                value={content.name}
                                key={content.id}
                                onSelect={() => {
                                  form.setValue('content', content.name);
                                  setActivityOpen(false);
                                }}
                              >
                                {content.name}
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    content.name === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </div>
      </form>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary" disabled={isPending}>
            Batal
          </Button>
        </DialogClose>
        <Button
          type="submit"
          variant="info"
          form="update-task-2"
          disabled={isPending}
        >
          {isPending && <Spinner />}
          {isPending ? 'Mengirim...' : 'Edit'}
        </Button>
      </DialogFooter>
    </>
  );
};

export default NewUpdateTaskForm;
