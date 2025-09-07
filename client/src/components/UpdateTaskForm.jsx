import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
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
import useModal from '@/stores/modalStore';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { id } from 'date-fns/locale';
import { TimePickerDemo } from './ui/time-picker-demo';

const FormSchema = z.object({
  content: z.string('Mohon pilih salah satu activity.'),
  pic_id: z.number().optional(),
  detail: z.string().optional(),
  // status: z.enum(['todo', 'on progress', 'done', 'archived'], {
  //   error: 'Status harus dipilih',
  // }),

  // timestamp_todo: z.iso.datetime({
  //   offset: true,
  //   error: 'Tanggal tidak sesuai',
  // }),

  timestamp_todo: z.date('Tanggal tidak sesuai.'),

  // timestamp_progress:,
  // timestamp_done:,
  // timestamp_archived:,
  // minute_pause: z.number().min(0, 'Durasi pause harus 0 atau lebih').default(0),
  // minute_activity: z
  //   .number()
  //   .min(0, { message: 'Durasi aktivitas harus 0 atau lebih' })
  //   .default(0),
});

export default function UpdateTaskForm() {
  // Fetch activity
  const contents = useActivities((state) => state.activities);
  // Fetch pics
  const pics = usePics((state) => state.pics);
  // Add Tasks
  const updateTask = useTasks((state) => state.updateTask);
  const error = useTasks((state) => state.error);
  // Close Modal
  const setIsModalOpen = useModal((state) => state.setIsModalOpen);

  const form = useForm({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data) => {
    const taskData = {
      content: data.content,
      pic_id: data.pic_id,
      detail: data.detail,
      // status: data.status,
      timestamp_todo: data.timestamp_todo.toISOString(),
    };

    console.log(taskData);

    // toast({
    //   title: 'You submitted the following values:',
    //   description: (
    //     <pre>
    //       <code>{JSON.stringify(taskData, null, 2)}</code>
    //     </pre>
    //   ),
    // });

    // await toast.promise(updateTask(data), {
    //   loading: 'Sedang memperbarui task...',
    //   success: 'Task telah diperbarui',
    //   error: `Error: ${error}`,
    // });
    form.reset(); // reset form setelah submit
    setIsModalOpen(false);
  };

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

        {/* Timestamp Todo */}
        <FormField
          control={form.control}
          name="timestamp_todo"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-left">Timestamp To Do</FormLabel>
              <Popover>
                <FormControl>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-[280px] justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, 'PPP, HH:mm:ss', { locale: id })
                      ) : (
                        <span>Pilih tanggal dan waktu</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                </FormControl>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    locale={id}
                    // captionLayout="dropdown"
                    weekStartsOn={1}
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                  <div className="p-3 border-t border-border">
                    <TimePickerDemo
                      setDate={field.onChange}
                      date={field.value}
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
