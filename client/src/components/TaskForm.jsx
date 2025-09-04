'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  activity: z.string('Mohon pilih activity!'),
  pic: z.string().optional(),
  detail: z.string().optional(),
});

export default function MyForm() {
  const activities = [
    {
      label: 'Sewing',
      value: 'Sewing',
    },
    {
      label: 'Packing',
      value: 'Packing',
    },
    {
      label: 'Meeting',
      value: 'Meeting',
    },
    {
      label: 'Learning1',
      value: 'Learning1',
    },
    {
      label: 'Learning2',
      value: 'Learning2',
    },
    {
      label: 'Learning3',
      value: 'Learning3',
    },
    {
      label: 'Learning4',
      value: 'Learning4',
    },
    {
      label: 'Learning5',
      value: 'Learning5',
    },
    {
      label: 'Learning6',
      value: 'Learning6',
    },
    {
      label: 'Learning7',
      value: 'Learning7',
    },
    {
      label: 'Learning8',
      value: 'Learning8',
    },
    {
      label: 'Learning9',
      value: 'Learning9',
    },
    {
      label: 'Learning10',
      value: 'Learning10',
    },
  ];
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values) {
    try {
      console.log(values);
      // toast(
      //   <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
      //     <code className="text-white">{JSON.stringify(values, null, 2)}</code>
      //   </pre>
      // );
      toast.success('Event has been created');
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Failed to submit the form. Please try again.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-2">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="activity"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Activity *</FormLabel>
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
                                (activity) => activity.value === field.value
                              )?.label
                            : 'Pilih activity'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Cari activity..." />
                        <CommandList>
                          <CommandEmpty>No activity found.</CommandEmpty>
                          <CommandGroup>
                            {activities.map((activity) => (
                              <CommandItem
                                value={activity.label}
                                key={activity.value}
                                onSelect={() => {
                                  form.setValue('activity', activity.value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    activity.value === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                                {activity.label}
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
                            ? activities.find(
                                (activity) => activity.value === field.value
                              )?.label
                            : 'Pilih PIC'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Cari PIC..." />
                        <CommandList>
                          <CommandEmpty>No activity found.</CommandEmpty>
                          <CommandGroup>
                            {activities.map((activity) => (
                              <CommandItem
                                value={activity.label}
                                key={activity.value}
                                onSelect={() => {
                                  form.setValue('pic', activity.value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    activity.value === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                                {activity.label}
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
