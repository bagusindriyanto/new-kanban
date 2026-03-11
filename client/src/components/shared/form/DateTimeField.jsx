import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { TimePickerDemo } from '@/components/ui/time-picker-demo';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { Trash2Icon } from 'lucide-react';
import { CalendarIcon } from 'lucide-react';
import React from 'react';
import { useId } from 'react';
import { Controller } from 'react-hook-form';

const DateTimeField = ({ name, control, label, isRequired, side }) => {
  const id = useId();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id} className="gap-0.5">
            {label}
            {isRequired && <span className="text-red-500">*</span>}
          </FieldLabel>
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  id={id}
                  aria-invalid={fieldState.invalid}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !field.value && 'text-muted-foreground',
                  )}
                  disabled={!isRequired}
                />
              }
            >
              <CalendarIcon data-icon="inline-start" />
              {field.value ? (
                format(field.value, 'd/M/yyyy, HH:mm:ss', {
                  locale: idLocale,
                })
              ) : (
                <span>Pilih tanggal dan waktu</span>
              )}
            </PopoverTrigger>
            <PopoverContent side={side} className="w-auto p-0">
              <Calendar
                mode="single"
                locale={idLocale}
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
                <TimePickerDemo setDate={field.onChange} date={field.value} />
                <Button
                  variant="ghost"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => form.setValue(name, undefined)}
                >
                  <Trash2Icon />
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default DateTimeField;
