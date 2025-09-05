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
import useActivities from '@/stores/activitiesStore';
import usePics from '@/stores/picsStore';

// const activities = [
//   { label: 'English', value: 'en' },
//   { label: 'French', value: 'fr' },
//   { label: 'German', value: 'de' },
//   { label: 'Spanish', value: 'es' },
//   { label: 'Portuguese', value: 'pt' },
//   { label: 'Russian', value: 'ru' },
//   { label: 'Japanese', value: 'ja' },
//   { label: 'Korean', value: 'ko' },
//   { label: 'Chinese', value: 'zh' },
//   { label: 'Indonesian', value: 'id' },
//   { label: 'Malaysia', value: 'my' },
//   { label: 'Philipines', value: 'ph' },
//   { label: 'Singapore', value: 'sg' },
//   { label: 'Thailand', value: 'th' },
//   { label: 'India', value: 'in' },
//   { label: 'New Zealand', value: 'nz' },
//   { label: 'Canada', value: 'cd' },
// ];

// const pics = [
//   { label: 'Annisa', value: 'Annisa' },
//   { label: 'Bagus', value: 'Bagus' },
//   { label: 'Indah', value: 'Indah' },
//   { label: 'Dani', value: 'Dani' },
//   { label: 'Ahmudi', value: 'Ahmudi' },
//   { label: 'Joe', value: 'Joe' },
//   { label: 'Jane', value: 'Jane' },
//   { label: 'Doe', value: 'Doe' },
//   { label: 'John', value: 'John' },
//   { label: 'Dika', value: 'Dika' },
//   { label: 'Bimo', value: 'Bimo' },
//   { label: 'Windah', value: 'Windah' },
//   { label: 'Nadiem', value: 'Nadiem' },
// ];

const FormSchema = z.object({
  activity: z.string('Mohon pilih salah satu activity.'),
  pic: z.string().optional(),
  detail: z.string().optional(),
});

export default function TaskForm() {
  // Fetch activity
  const activities = useActivities((state) => state.activities);
  // Fetch pics
  const pics = usePics((state) => state.pics);

  const form = useForm({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data) {
    toast('You submitted the following values', {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

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
              name="activity"
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
                            ? activities.find(
                                (activity) => activity.name === field.value
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
                            {activities.map((activity) => (
                              <CommandItem
                                value={activity.name}
                                key={activity.id}
                                onSelect={() => {
                                  form.setValue('activity', activity.name);
                                }}
                              >
                                {activity.name}
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    activity.name === field.value
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
              name="pic"
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
                            ? pics.find((pic) => pic.name === field.value)?.name
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
                                  form.setValue('pic', pic.name);
                                }}
                              >
                                {pic.name}
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    pic.name === field.value
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
