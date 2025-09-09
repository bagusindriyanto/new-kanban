import * as React from 'react';
import { Clock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { TimePickerInput } from './time-picker-input';

export function TimePickerDemo({ date, setDate }) {
  const minuteRef = React.useRef(null);
  const hourRef = React.useRef(null);
  const secondRef = React.useRef(null);

  return (
    <div className="flex items-end gap-1">
      <div className="flex h-9 ml-2 mr-1 items-center">
        <Clock className="h-4 w-4" />
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
