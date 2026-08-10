import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { id } from 'date-fns/locale';
import { startOfDay, startOfWeek, startOfMonth, subDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useFilterStore } from '@/stores/filterStore';
import type { DropdownProps } from '@daypicker/react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { FieldSeparator } from '@/components/ui/field';

const PRESETS = [
  {
    label: 'Hari Ini',
    range: {
      from: startOfDay(new Date()),
      to: undefined,
    },
  },
  {
    label: 'Kemarin',
    range: {
      from: subDays(startOfDay(new Date()), 1),
      to: subDays(startOfDay(new Date()), 1),
    },
  },
  {
    label: 'Minggu Ini',
    range: {
      from: startOfWeek(new Date(), { weekStartsOn: 1 }),
      to: startOfDay(new Date()),
    },
  },
  {
    label: 'Bulan Ini',
    range: {
      from: startOfMonth(new Date()),
      to: startOfDay(new Date()),
    },
  },
] as const;

const DateDropdown = ({
  options,
  value,
  onChange,
  'aria-label': ariaLabel,
}: DropdownProps) => {
  const handleValueChange = (newValue: string | null) => {
    if (onChange && newValue !== null) {
      const syntheticEvent = {
        target: {
          value: newValue,
        },
      } as React.ChangeEvent<HTMLSelectElement>;

      onChange(syntheticEvent);
    }
  };

  return (
    <Select
      items={options}
      value={String(value)}
      onValueChange={handleValueChange}
    >
      <SelectTrigger aria-label={ariaLabel}>
        <SelectValue>
          {options?.find((option) => option.value === value)?.label || ''}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-100 min-w-fit">
        <SelectGroup>
          {options?.map((option) => (
            <SelectItem
              key={option.value}
              value={String(option.value)}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export const FilterCalendar = ({ title }: { title?: string }) => {
  const range = useFilterStore((state) => state.range);
  const setRange = useFilterStore((state) => state.setRange);
  const [currentMonth, setCurrentMonth] = useState<Date | undefined>(
    range?.from,
  );

  const isPresetActive = (presetRange: { from?: Date; to?: Date }) => {
    if (!presetRange.from && !presetRange.to) {
      return !range?.from && !range?.to;
    }
    return (
      range?.from?.getTime() === presetRange.from?.getTime() &&
      range?.to?.getTime() === presetRange.to?.getTime()
    );
  };

  const dateLabel = range?.from
    ? range?.to
      ? range.from.getTime() === range.to.getTime()
        ? range?.from.toLocaleDateString('id')
        : `${range?.from.toLocaleDateString('id')} - ${range?.to.toLocaleDateString('id')}`
      : range?.from.toLocaleDateString('id')
    : 'Semua Hari';

  return (
    <Popover>
      <PopoverTrigger render={<Button variant="secondary" size="sm" />}>
        <CalendarIcon data-icon="inline-start" />
        {dateLabel}
      </PopoverTrigger>
      <PopoverContent align="end" className="p-0 w-auto gap-2">
        {title && (
          <div className="px-4 pt-4 pb-1">
            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-popover">
              {title}
            </FieldSeparator>
          </div>
        )}
        <Calendar
          mode="range"
          max={30}
          required
          resetOnSelect
          locale={id}
          showWeekNumber
          captionLayout="dropdown"
          components={{ Dropdown: DateDropdown }}
          classNames={{
            nav: 'flex items-center w-full absolute top-0 inset-x-0 justify-between pointer-events-none [&>button]:pointer-events-auto',
          }}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          weekStartsOn={1}
          selected={range}
          onSelect={setRange}
          disabled={{ after: new Date() }}
        />
        <div className="grid grid-cols-2 gap-2 p-3 border-t">
          {PRESETS.map((preset) => (
            <Button
              key={preset.label}
              variant={isPresetActive(preset.range) ? 'default' : 'outline'}
              onClick={() => {
                setRange(preset.range);
                setCurrentMonth(preset.range.from);
              }}
              size="sm"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
