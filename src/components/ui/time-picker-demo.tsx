import * as React from 'react';
import { ClockIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { TimePickerInput } from './time-picker-input';

type TimePickerDemoProps = {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
};

export function TimePickerDemo({ date, setDate }: TimePickerDemoProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const secondRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-end gap-1">
      <div className="flex h-9 ml-2 mr-1 items-center">
        <ClockIcon className="h-4 w-4" />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs m-auto">
          Jam
        </Label>
        <TimePickerInput
          picker="hours"
          date={date}
          setDate={setDate}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs m-auto">
          Menit
        </Label>
        <TimePickerInput
          picker="minutes"
          date={date}
          setDate={setDate}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
          onRightFocus={() => secondRef.current?.focus()}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="seconds" className="text-xs m-auto">
          Detik
        </Label>
        <TimePickerInput
          picker="seconds"
          date={date}
          setDate={setDate}
          ref={secondRef}
          onLeftFocus={() => minuteRef.current?.focus()}
        />
      </div>
    </div>
  );
}
