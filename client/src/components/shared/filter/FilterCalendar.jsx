import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { id } from 'date-fns/locale';
import { startOfDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import useFilter from '@/stores/filterStore';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const DateDropdown = ({
  options,
  value,
  onChange,
  'aria-label': ariaLabel,
}) => {
  const handleValueChange = (newValue) => {
    if (onChange && newValue !== null) {
      const syntheticEvent = {
        target: {
          value: newValue,
        },
      };

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

export const FilterCalendar = () => {
  const range = useFilter((state) => state.range);
  const setRange = useFilter((state) => state.setRange);

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
      <PopoverContent className="p-0 w-auto">
        <Calendar
          mode="range"
          resetOnSelect
          locale={id}
          showWeekNumber
          captionLayout="dropdown"
          components={{ Dropdown: DateDropdown }}
          classNames={{
            nav: 'flex items-center w-full absolute top-0 inset-x-0 justify-between pointer-events-none [&>button]:pointer-events-auto',
          }}
          defaultMonth={range.from}
          weekStartsOn={1}
          selected={range}
          onSelect={setRange}
          disabled={{ after: new Date() }}
        />
        <div className="flex gap-3 justify-between items-end p-3 border-t border-border">
          <Button
            className="flex-1"
            variant="outline"
            onClick={() =>
              setRange({
                from: startOfDay(new Date()),
                to: startOfDay(new Date()),
              })
            }
          >
            Hari Ini
          </Button>
          <Button
            className="flex-1"
            variant="outline"
            onClick={() => setRange({ from: null, to: null })}
          >
            Semua Hari
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
