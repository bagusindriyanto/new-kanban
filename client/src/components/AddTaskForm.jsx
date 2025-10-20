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
import useFormModal from '@/stores/formModalStore';
import { useState } from 'react';
import { useFetchActivities } from '@/api/fetchActivities';
import { useFetchPics } from '@/api/fetchPics';
import { useAddTask } from '@/api/addTask';

const FormSchema = z.object({
  content: z.string('Mohon pilih salah satu activity.'),
  pic_id: z.number().nullish(),
  detail: z.string().optional(),
});

export default function AddTaskForm() {
  // State Buka/Tutup Popover
  const [activityOpen, setActivityOpen] = useState(false);
  const [picOpen, setPicOpen] = useState(false);
  // Fetch activity
  const { data: contents } = useFetchActivities();
  // Fetch pics
  const { data: pics } = useFetchPics();
  // Add Tasks
  const { mutateAsync: addTaskMutation } = useAddTask();
  // Close Modal
  const setIsModalOpen = useFormModal((state) => state.setIsModalOpen);
  // Proses Kirim Data
  const setIsLoading = useFormModal((state) => state.setIsLoading);

  const form = useForm({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = (data) => {
    toast.promise(addTaskMutation(data), {
      loading: () => {
        setIsLoading(true);
        return 'Sedang menambahkan task...';
      },
      success: () => {
        form.reset(); // reset form setelah submit
        setIsModalOpen(false);
        setIsLoading(false);
        return 'Task berhasil ditambahkan';
      },
      error: (err) => {
        setIsLoading(false);
        // err adalah error yang dilempar dari store
        return err.message || 'Gagal menambahkan task';
      },
    });
  };

  return (
    <Form {...form}>
      <form
        id="addTask"
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
                  <Popover open={activityOpen} onOpenChange={setActivityOpen}>
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
                          <span className="truncate">
                            {field.value
                              ? contents?.find(
                                  (content) => content.name === field.value
                                )?.name
                              : 'Pilih activity'}
                          </span>
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
                  <Popover open={picOpen} onOpenChange={setPicOpen}>
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
                            ? pics?.find((pic) => pic.id === field.value)?.name
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
                                setPicOpen(false);
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
      </form>
    </Form>
  );
}
