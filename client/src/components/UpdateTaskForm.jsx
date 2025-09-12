import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, Trash2Icon } from 'lucide-react';
import { useForm } from 'react-hook-form';
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
import { Input } from '@/components/ui/input';
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
import { Textarea } from '@/components/ui/textarea';
import useActivities from '@/stores/activityStore';
import usePics from '@/stores/picStore';
import useTasks from '@/stores/taskStore';
import useFormModal from '@/stores/formModalStore';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { id } from 'date-fns/locale';
import { TimePickerDemo } from './ui/time-picker-demo';

// Aturan form
const FormSchema = z.object({
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
  detail: z.string().optional(),
  timestamp_todo: z.date('Mohon isi tanggal dan waktu.'),
  timestamp_progress: z.date('Mohon isi tanggal dan waktu.').nullish(),
  timestamp_done: z.date('Mohon isi tanggal dan waktu.').nullish(),
  timestamp_archived: z.date('Mohon isi tanggal dan waktu.').nullish(),
  password: z.string().nonempty({ message: 'Mohon isi password.' }),
});

export default function UpdateTaskForm() {
  // Fetch activity
  const contents = useActivities((state) => state.activities);
  // Fetch pics
  const pics = usePics((state) => state.pics);
  // Fetch task yang dipilih
  const tasks = useTasks((state) => state.tasks);
  const selectedTaskId = useTasks((state) => state.selectedTaskId);
  const task = tasks.filter((task) => task.id === selectedTaskId)[0];

  // Update Tasks
  const updateTask = useTasks((state) => state.updateTask);
  const error = useTasks((state) => state.error);

  // Close Modal
  const setIsModalOpen = useFormModal((state) => state.setIsModalOpen);

  // Set nilai awal form
  const form = useForm({
    resolver: zodResolver(FormSchema),
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

      toast.promise(updateTask(selectedTaskId, taskData), {
        loading: 'Sedang memperbarui task...',
        success: () => {
          form.reset();
          setIsModalOpen(false);
          return 'Task berhasil diperbarui';
        },
        error: (err) => {
          // err adalah error yang dilempar dari store
          return err.message || 'Gagal memperbarui task';
        },
      });
    } else {
      toast.error('Password salah!');
      form.setValue('password', '');
    }
  };

  // Form
  return (
    <Form {...form}>
      <form
        id="updateTask"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-12 gap-4">
          {/* Activity */}
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="gap-1">
                    Activity<span className="text-red-500">*</span>
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-full justify-between',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? contents.find(
                                (content) => content.name === field.value
                              )?.name
                            : 'Pilih activity'}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
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
                            {contents.map((content) => (
                              <CommandItem
                                value={content.name}
                                key={content.id}
                                onSelect={() => {
                                  form.setValue('content', content.name);
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* PIC */}
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="pic_id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>PIC</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-full justify-between',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? pics.find((pic) => pic.id === field.value)?.name
                            : 'Pilih PIC'}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
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
                            <CommandItem
                              value="null"
                              onSelect={() => {
                                form.setValue('pic_id', null);
                              }}
                            >
                              -
                              <Check
                                className={cn(
                                  'ml-auto',
                                  field.value === null
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                            </CommandItem>
                            {pics.map((pic) => (
                              <CommandItem
                                value={pic.name}
                                key={pic.id}
                                onSelect={() => {
                                  form.setValue('pic_id', pic.id);
                                }}
                              >
                                {pic.name}
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    pic.id === field.value
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Status */}
          <div className="col-span-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-1">
                    Status<span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status task" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="on progress">On Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Minute Pause */}
          <div className="col-span-4">
            <FormField
              control={form.control}
              name="minute_pause"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durasi Pause</FormLabel>
                  <div className="flex items-center gap-3">
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        className="w-1/2"
                      />
                    </FormControl>
                    <p>Menit</p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Pause Time */}
          <div className="col-span-4">
            <FormField
              control={form.control}
              name="pause_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-1">
                    Activity di Pause?<span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="flex justify-center items-center h-9 gap-3">
                    <p>Tidak</p>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <p>Ya</p>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Grid Timestamp */}
        <div className="grid grid-cols-2 gap-4">
          {/* Timestamp Todo */}
          <FormField
            control={form.control}
            name="timestamp_todo"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-left gap-1">
                  Timestamp To Do<span className="text-red-500">*</span>
                </FormLabel>
                <Popover>
                  <FormControl>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, 'd/M/yyyy, HH:mm:ss', {
                            locale: id,
                          })
                        ) : (
                          <span>Pilih tanggal dan waktu</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                  </FormControl>
                  <PopoverContent side="left" className="w-auto p-0">
                    <Calendar
                      mode="single"
                      locale={id}
                      // captionLayout="dropdown"
                      weekStartsOn={1}
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
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
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Timestamp On Progress */}
          <FormField
            control={form.control}
            name="timestamp_progress"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-left gap-1">
                  Timestamp On Progress<span className="text-red-500">*</span>
                </FormLabel>
                <Popover>
                  <FormControl>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, 'd/M/yyyy, HH:mm:ss', {
                            locale: id,
                          })
                        ) : (
                          <span>Pilih tanggal dan waktu</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                  </FormControl>
                  <PopoverContent side="right" className="w-auto p-0">
                    <Calendar
                      mode="single"
                      locale={id}
                      // captionLayout="dropdown"
                      weekStartsOn={1}
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                    <div className="px-3 py-2 flex gap-1 justify-between items-end border-t border-border">
                      <TimePickerDemo
                        setDate={field.onChange}
                        date={field.value}
                      />
                      <Button
                        variant="ghost"
                        type="button"
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
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Timestamp Done */}
          <FormField
            control={form.control}
            name="timestamp_done"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-left gap-1">
                  Timestamp Done<span className="text-red-500">*</span>
                </FormLabel>
                <Popover>
                  <FormControl>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, 'd/M/yyyy, HH:mm:ss', {
                            locale: id,
                          })
                        ) : (
                          <span>Pilih tanggal dan waktu</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                  </FormControl>
                  <PopoverContent side="left" className="w-auto p-0">
                    <Calendar
                      mode="single"
                      locale={id}
                      // captionLayout="dropdown"
                      weekStartsOn={1}
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                    <div className="px-3 py-2 flex gap-1 justify-between items-end border-t border-border">
                      <TimePickerDemo
                        setDate={field.onChange}
                        date={field.value}
                      />
                      <Button
                        variant="ghost"
                        type="button"
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
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Timestamp Archived */}
          <FormField
            control={form.control}
            name="timestamp_archived"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-left gap-1">
                  Timestamp Archived<span className="text-red-500">*</span>
                </FormLabel>
                <Popover>
                  <FormControl>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, 'd/M/yyyy, HH:mm:ss', {
                            locale: id,
                          })
                        ) : (
                          <span>Pilih tanggal dan waktu</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                  </FormControl>
                  <PopoverContent side="right" className="w-auto p-0">
                    <Calendar
                      mode="single"
                      locale={id}
                      // captionLayout="dropdown"
                      weekStartsOn={1}
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                    <div className="px-3 py-2 flex gap-1 justify-between items-end border-t border-border">
                      <TimePickerDemo
                        setDate={field.onChange}
                        date={field.value}
                      />
                      <Button
                        variant="ghost"
                        type="button"
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Detail */}
        <FormField
          control={form.control}
          name="detail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detail</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detail task"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Input Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex gap-1">
                Masukkan Password<span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input type="password" autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
