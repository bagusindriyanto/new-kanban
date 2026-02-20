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
import useUpdateTaskModal from '@/stores/updateTaskModalStore';

import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { id } from 'date-fns/locale';
import { TimePickerDemo } from './ui/time-picker-demo';
import { useState } from 'react';
import { useFetchActivities } from '@/api/fetchActivities';
import { useFetchPICs } from '@/api/fetchPICs';
import { useUpdateTask } from '@/api/updateTask';
import { useFetchTasks } from '@/api/fetchTasks';
import { ScrollArea } from './ui/scroll-area';
import useTaskFilters from '@/hooks/useTaskFilters';

const formSchema = z
  .object({
    content: z.string('Activity harus dipilih.'),
    pic_id: z.number('PIC harus dipilih.'),
    status: z.enum(['todo', 'on progress', 'done', 'archived'], {
      error: 'Status harus dipilih.',
    }),
    minute_pause: z.coerce
      .number()
      .min(0, 'Durasi pause harus 0 atau lebih.')
      .default(0),
    pause_time: z.boolean(),
    detail: z.string().trim().optional(),
    timestamp_todo: z.date('Mohon isi tanggal dan waktu.'),
    timestamp_progress: z.date('Mohon isi tanggal dan waktu.').nullish(),
    timestamp_done: z.date('Mohon isi tanggal dan waktu.').nullish(),
    timestamp_archived: z.date('Mohon isi tanggal dan waktu.').nullish(),
    is_scheduled: z.boolean(),
    scheduled_at: z.date().nullish(),
    password: z.string().min(1, 'Mohon isi password.'),
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
      data.timestamp_progress && data.timestamp_done
        ? Math.floor((data.timestamp_done - data.timestamp_progress) / 60000) -
          data.minute_pause
        : 0,
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
    scheduled_at: data.is_scheduled ? data.scheduled_at.toISOString() : null,
  }));

const UpdateTaskForm = () => {
  // State Buka/Tutup Popover
  const [activityOpen, setActivityOpen] = useState(false);
  const [picOpen, setPicOpen] = useState(false);
  // Tampilkan Password/Tidak
  const [showPassword, setShowPassword] = useState(false);
  // Custom hook untuk logic filter
  const { queryParams } = useTaskFilters();
  // Fetch data
  const { data: contents } = useFetchActivities();
  const { data: pics } = useFetchPICs();
  const { data: tasks } = useFetchTasks(queryParams);

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
      is_scheduled: !!task.scheduled_at,
      scheduled_at: task.scheduled_at ? new Date(task.scheduled_at) : undefined,
      password: '',
    },
  });

  // Cek input status untuk disable timestamp
  const statusInput = form.watch('status');
  const isScheduled = form.watch('is_scheduled');

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
    if (data.password === 'Semarang@2025') {
      toast.promise(updateTaskMutate({ ...data, id: selectedTaskId }), {
        loading: () => {
          return 'Sedang memperbarui task...';
        },
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
    } else {
      toast.error('Password salah!');
      form.setValue('password', '');
    }
  };

  // Form
  return (
    <>
      <ScrollArea className="-mx-4 px-3 max-h-[60vh]">
        <form
          id="update-task"
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-1"
        >
          <div className="grid grid-cols-6 gap-4">
            {/* Activity */}
            <div className="col-span-3">
              <Controller
                name="content"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="update-task-content"
                      className="gap-0.5"
                    >
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
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          <span className="truncate">
                            {field.value
                              ? contents?.find(
                                  (content) => content.name === field.value,
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
                            <CommandEmpty>
                              Activity tidak ditemukan.
                            </CommandEmpty>
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
                                        : 'opacity-0',
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
            {/* PIC */}
            <div className="col-span-3">
              <Controller
                name="pic_id"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="update-task-pic" className="gap-0.5">
                      PIC<span className="text-red-500">*</span>
                    </FieldLabel>
                    <Popover open={picOpen} onOpenChange={setPicOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          id="update-task-pic"
                          aria-invalid={fieldState.invalid}
                          className={cn(
                            'w-full justify-between',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          <span className="truncate">
                            {field.value
                              ? pics?.find((pic) => pic.id === field.value)
                                  ?.name
                              : 'Pilih PIC'}
                          </span>
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="PopoverContent p-0">
                        <Command>
                          <CommandInput
                            placeholder="Cari PIC..."
                            className="h-9"
                          />
                          <CommandList
                            onWheel={(e) => {
                              e.stopPropagation(); // Cegah event wheel menyebar ke Dialog
                            }}
                          >
                            <CommandEmpty>PIC tidak ditemukan.</CommandEmpty>
                            <CommandGroup>
                              {pics?.map((pic) => (
                                <CommandItem
                                  value={pic.name}
                                  key={pic.id}
                                  onSelect={() => {
                                    form.setValue('pic_id', pic.id);
                                    setPicOpen(false);
                                  }}
                                >
                                  {pic.name}
                                  <Check
                                    className={cn(
                                      'ml-auto',
                                      pic.id === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0',
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
            {/* Status */}
            <div className="col-span-2">
              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="update-task-status"
                      className="gap-0.5"
                    >
                      Status<span className="text-red-500">*</span>
                    </FieldLabel>
                    <Select
                      name={field.name}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger
                        id="update-task-status"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Pilih status task" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          <SelectItem value="todo">
                            <span className="w-1 h-3 shrink-0 rounded-full bg-todo-500"></span>
                            To Do
                          </SelectItem>
                          <SelectItem value="on progress">
                            <span className="w-1 h-3 shrink-0 rounded-full bg-progress-500"></span>
                            On Progress
                          </SelectItem>
                          <SelectItem value="done">
                            <span className="w-1 h-3 shrink-0 rounded-full bg-done-500"></span>
                            Done
                          </SelectItem>
                          <SelectItem value="archived">
                            <span className="w-1 h-3 shrink-0 rounded-full bg-archived-500"></span>
                            Archived
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            {/* Minute Pause */}
            <div className="col-span-2">
              <Controller
                name="minute_pause"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="update-task-minute-pause">
                      Durasi Pause
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id="update-task-minute-pause"
                        aria-invalid={fieldState.invalid}
                        type="number"
                        min="0"
                        className="text-center"
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupText>Menit</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            {/* Pause Time */}
            <div className="col-span-2">
              <Controller
                name="pause_time"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="update-task-pause-time"
                      className="gap-0.5"
                    >
                      Activity di Pause?<span className="text-red-500">*</span>
                    </FieldLabel>
                    <div className="flex justify-center items-center h-9 gap-3">
                      <Label htmlFor="update-task-pause-time">Tidak</Label>
                      <Switch
                        id="update-task-pause-time"
                        name={field.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-invalid={fieldState.invalid}
                      />
                      <Label htmlFor="update-task-pause-time">Ya</Label>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            {/* Timestamp Todo */}
            <div className="col-span-3">
              <Controller
                name="timestamp_todo"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="update-task-timestamp-todo"
                      className="gap-0.5"
                    >
                      Timestamp To Do<span className="text-red-500">*</span>
                    </FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="update-task-timestamp-todo"
                          aria-invalid={fieldState.invalid}
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          <CalendarIcon className="mr-2 size-4" />
                          {field.value ? (
                            format(field.value, 'd/M/yyyy, HH:mm:ss', {
                              locale: id,
                            })
                          ) : (
                            <span>Pilih tanggal dan waktu</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent side="left" className="w-auto p-0">
                        <Calendar
                          mode="single"
                          locale={id}
                          captionLayout="dropdown"
                          weekStartsOn={1}
                          selected={field.value}
                          onSelect={field.onChange}
                          startMonth={new Date(2011, 12)}
                          disabled={{
                            before: new Date('2012-01-01'),
                            after: new Date(),
                          }}
                          initialFocus
                        />
                        <div className="px-3 py-2 flex gap-1 justify-between items-end border-t border-border">
                          <TimePickerDemo
                            setDate={field.onChange}
                            date={field.value}
                          />
                          <Button variant="ghost" disabled>
                            <Trash2Icon />
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            {/* Timestamp On Progress */}
            <div className="col-span-3">
              <Controller
                name="timestamp_progress"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="update-task-timestamp-progress"
                      className="gap-0.5"
                    >
                      Timestamp On Progress
                      <span
                        className={cn('text-red-500', {
                          hidden: statusInput === 'todo',
                        })}
                      >
                        *
                      </span>
                    </FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="update-task-timestamp-progress"
                          aria-invalid={fieldState.invalid}
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                          disabled={statusInput === 'todo'}
                        >
                          <CalendarIcon className="mr-2 size-4" />
                          {field.value ? (
                            format(field.value, 'd/M/yyyy, HH:mm:ss', {
                              locale: id,
                            })
                          ) : (
                            <span>Pilih tanggal dan waktu</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent side="right" className="w-auto p-0">
                        <Calendar
                          mode="single"
                          locale={id}
                          captionLayout="dropdown"
                          weekStartsOn={1}
                          selected={field.value}
                          onSelect={field.onChange}
                          startMonth={new Date(2011, 12)}
                          disabled={{
                            before: new Date('2012-01-01'),
                            after: new Date(),
                          }}
                          initialFocus
                        />
                        <div className="px-3 py-2 flex gap-1 justify-between items-end border-t border-border">
                          <TimePickerDemo
                            setDate={field.onChange}
                            date={field.value}
                          />
                          <Button
                            variant="ghost"
                            className="text-red-500 hover:text-red-600"
                            onClick={() =>
                              form.setValue('timestamp_progress', undefined)
                            }
                          >
                            <Trash2Icon />
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            {/* Timestamp Done */}
            <div className="col-span-3">
              <Controller
                name="timestamp_done"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="update-task-timestamp-done"
                      className="gap-0.5"
                    >
                      Timestamp Done
                      <span
                        className={cn('text-red-500', {
                          hidden:
                            statusInput === 'todo' ||
                            statusInput === 'on progress',
                        })}
                      >
                        *
                      </span>
                    </FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="update-task-timestamp-done"
                          aria-invalid={fieldState.invalid}
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                          disabled={
                            statusInput === 'todo' ||
                            statusInput === 'on progress'
                          }
                        >
                          <CalendarIcon className="mr-2 size-4" />
                          {field.value ? (
                            format(field.value, 'd/M/yyyy, HH:mm:ss', {
                              locale: id,
                            })
                          ) : (
                            <span>Pilih tanggal dan waktu</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent side="left" className="w-auto p-0">
                        <Calendar
                          mode="single"
                          locale={id}
                          captionLayout="dropdown"
                          weekStartsOn={1}
                          selected={field.value}
                          onSelect={field.onChange}
                          startMonth={new Date(2011, 12)}
                          disabled={{
                            before: new Date('2012-01-01'),
                            after: new Date(),
                          }}
                          initialFocus
                        />
                        <div className="px-3 py-2 flex gap-1 justify-between items-end border-t border-border">
                          <TimePickerDemo
                            setDate={field.onChange}
                            date={field.value}
                          />
                          <Button
                            variant="ghost"
                            className="text-red-500 hover:text-red-600"
                            onClick={() =>
                              form.setValue('timestamp_done', undefined)
                            }
                          >
                            <Trash2Icon />
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            {/* Timestamp Archived */}
            <div className="col-span-3">
              <Controller
                name="timestamp_archived"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="update-task-timestamp-archived"
                      className="gap-0.5"
                    >
                      Timestamp Archived
                      <span
                        className={cn('text-red-500', {
                          hidden: statusInput !== 'archived',
                        })}
                      >
                        *
                      </span>
                    </FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="update-task-timestamp-archived"
                          aria-invalid={fieldState.invalid}
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                          disabled={statusInput !== 'archived'}
                        >
                          <CalendarIcon className="mr-2 size-4" />
                          {field.value ? (
                            format(field.value, 'd/M/yyyy, HH:mm:ss', {
                              locale: id,
                            })
                          ) : (
                            <span>Pilih tanggal dan waktu</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent side="right" className="w-auto p-0">
                        <Calendar
                          mode="single"
                          locale={id}
                          captionLayout="dropdown"
                          weekStartsOn={1}
                          selected={field.value}
                          onSelect={field.onChange}
                          startMonth={new Date(2011, 12)}
                          disabled={{
                            before: new Date('2012-01-01'),
                            after: new Date(),
                          }}
                          initialFocus
                        />
                        <div className="px-3 py-2 flex gap-1 justify-between items-end border-t border-border">
                          <TimePickerDemo
                            setDate={field.onChange}
                            date={field.value}
                          />
                          <Button
                            variant="ghost"
                            className="text-red-500 hover:text-red-600"
                            onClick={() =>
                              form.setValue('timestamp_archived', undefined)
                            }
                          >
                            <Trash2Icon />
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            {/* Appointment Switch */}
            <div className="col-span-3 flex items-center">
              <Controller
                name="is_scheduled"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    orientation="horizontal"
                  >
                    <Switch
                      id="update-task-is-scheduled"
                      name={field.name}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldLabel htmlFor="update-task-is-scheduled">
                      Jadwalkan Task?
                    </FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            {/* Appointment Date */}
            <div className="col-span-3">
              <Controller
                name="scheduled_at"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="update-task-scheduled-at"
                      className="gap-0.5"
                    >
                      Tanggal & Waktu Jadwal
                      <span
                        className={cn('text-red-500', {
                          hidden: !isScheduled,
                        })}
                      >
                        *
                      </span>
                    </FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="update-task-scheduled-at"
                          aria-invalid={fieldState.invalid}
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                          disabled={!isScheduled}
                        >
                          <CalendarIcon className="mr-2 size-4" />
                          {field.value ? (
                            format(field.value, 'd/M/yyyy, HH:mm:ss', {
                              locale: id,
                            })
                          ) : (
                            <span>Pilih tanggal dan waktu</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent side="right" className="w-auto p-0">
                        <Calendar
                          mode="single"
                          locale={id}
                          captionLayout="dropdown"
                          weekStartsOn={1}
                          selected={field.value}
                          onSelect={field.onChange}
                          startMonth={new Date(2011, 12)}
                          disabled={{
                            before: new Date(),
                          }}
                          initialFocus
                        />
                        <div className="px-3 py-2 flex gap-1 justify-between items-end border-t border-border">
                          <TimePickerDemo
                            setDate={field.onChange}
                            date={field.value}
                          />
                          <Button
                            variant="ghost"
                            className="text-red-500 hover:text-red-600"
                            onClick={() =>
                              form.setValue('scheduled_at', undefined)
                            }
                          >
                            <Trash2Icon />
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            {/* Detail */}
            <div className="col-span-6">
              <Controller
                name="detail"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="update-task-detail">Detail</FieldLabel>
                    <Textarea
                      {...field}
                      id="update-task-detail"
                      aria-invalid={fieldState.invalid}
                      placeholder="Detail task"
                      className="resize-none"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <div className="col-span-6">
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="update-task-password"
                      className="gap-0.5"
                    >
                      Masukkan Password<span className="text-red-500">*</span>
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        id="update-task-password"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          onMouseDown={() => setShowPassword(true)}
                          onMouseUp={() => setShowPassword(false)}
                        >
                          {showPassword ? <EyeClosed /> : <Eye />}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </div>
        </form>
      </ScrollArea>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary" disabled={isPending}>
            Batal
          </Button>
        </DialogClose>
        <Button
          type="submit"
          variant="info"
          form="update-task"
          disabled={isPending}
        >
          {isPending && <Spinner />}
          {isPending ? 'Mengirim...' : 'Edit'}
        </Button>
      </DialogFooter>
    </>
  );
};

export default UpdateTaskForm;
