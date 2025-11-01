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

export const FilterCalendar = () => {
  // State untuk filter tanggal
  const range = useFilter((state) => state.range);
  const setRange = useFilter((state) => state.setRange);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <CalendarIcon />
          {range.from && range.to
            ? range.from.getTime() === range.to.getTime()
              ? range.from.toLocaleDateString('id')
              : `${range.from.toLocaleDateString(
                  'id'
                )} - ${range.to.toLocaleDateString('id')}`
            : 'Semua Hari'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0">
        <Calendar
          className="w-full"
          mode="range"
          locale={id}
          showWeekNumber
          captionLayout="dropdown"
          defaultMonth={range.from}
          weekStartsOn={1}
          // max={6}
          selected={range}
          onSelect={setRange}
          startMonth={new Date(2011, 12)}
          disabled={(date) =>
            date > new Date() || date <= new Date('2011-12-31')
          }
        />
        <div className="p-3 flex gap-3 justify-between items-end border-t border-border">
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
