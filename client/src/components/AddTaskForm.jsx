import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Check, ChevronsUpDown, Trash2Icon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useFetchActivities } from '@/api/fetchActivities';
import { useFetchPICs } from '@/api/fetchPICs';
import { Switch } from './ui/switch';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { TimePickerDemo } from './ui/time-picker-demo';

const formSchema = z
  .object({
    content: z.string('Mohon pilih salah satu activity.'),
    pic_id: z.number().nullish(),
    detail: z.string().trim().optional(),
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
  .transform((data) => {
    if (!data.is_scheduled) {
      return {
        ...data,
        scheduled_at: undefined,
      };
    }
    return {
      ...data,
      scheduled_at: data.scheduled_at.toISOString(),
    };
  });

const AddTaskForm = ({ mutateAsync, onOpenChange }) => {
  // State Buka/Tutup Popover
  const [activityOpen, setActivityOpen] = useState(false);
  const [picOpen, setPicOpen] = useState(false);
  // Fetch activity
  const { data: contents } = useFetchActivities();
  // Fetch pics
  const { data: pics } = useFetchPICs();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      is_scheduled: false,
    },
  });

  const isScheduled = form.watch('is_scheduled');

  const onSubmit = (data) => {
    // console.log(data);
    // return;
    toast.promise(mutateAsync(data), {
      loading: () => {
        return 'Sedang menambahkan task...';
      },
      success: () => {
        form.reset(); // reset form setelah submit
        onOpenChange(false);
        return 'Task berhasil ditambahkan.';
      },
      error: (err) => {
        // err adalah error yang dilempar dari store
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
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          {/* Activity */}
          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="add-task-content" className="gap-0.5">
                  Activity<span className="text-red-500">*</span>
                </FieldLabel>
                <Popover open={activityOpen} onOpenChange={setActivityOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      id="add-task-content"
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
          {/* PIC */}
          <Controller
            name="pic_id"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="add-task-pic">PIC</FieldLabel>
                <Popover open={picOpen} onOpenChange={setPicOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      id="add-task-pic"
                      className={cn(
                        'w-full justify-between',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      <span className="truncate">
                        {field.value
                          ? pics?.find((pic) => pic.id === field.value)?.name
                          : 'Pilih PIC'}
                      </span>
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="PopoverContent p-0">
                    <Command>
                      <CommandInput placeholder="Cari PIC..." className="h-9" />
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
                              setPicOpen(false);
                            }}
                          >
                            -
                            <Check
                              className={cn(
                                'ml-auto',
                                field.value === null
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                          </CommandItem>
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
          {/* Appointment */}
          {/* Appointment Switch */}
          <Controller
            name="is_scheduled"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} orientation="horizontal">
                <Switch
                  id="add-task-is-scheduled"
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                />
                <FieldLabel htmlFor="add-task-is-scheduled">
                  Appointment
                </FieldLabel>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {/* Appointment Date */}
          {isScheduled && (
            <Controller
              name="scheduled_at"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="add-task-scheduled-at"
                    className="gap-0.5"
                  >
                    Jadwal Appointment
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="add-task-scheduled-at"
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
          )}
        </div>
        {/* Detail */}
        <Controller
          name="detail"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="add-task-detail">Detail</FieldLabel>
              <Textarea
                {...field}
                id="add-task-detail"
                aria-invalid={fieldState.invalid}
                placeholder="Detail task"
                className="resize-none"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
};

export default AddTaskForm;
