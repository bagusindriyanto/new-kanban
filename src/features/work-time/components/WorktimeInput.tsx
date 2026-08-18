import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { format } from 'date-fns';
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field';
import { useFetchWorkTime } from '../api/fetchWorkTime';
import { useUpsertWorkTime } from '../api/upsertWorkTime';
import useAuthStore from '@/stores/authStore';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';

const DEBOUNCE_MS = 500;
const MAX_HOURS = 12;
const MAX_MINUTES = 59;

type WorktimeFieldsProps = {
  initialHours: number | null;
  initialMinutes: number | null;
};

const WorktimeFields = ({
  initialHours,
  initialMinutes,
}: WorktimeFieldsProps) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const userId = currentUser?.id ?? '';
  const today = format(new Date(), 'yyyy-MM-dd');

  const { mutate: upsertWorkTime } = useUpsertWorkTime({
    mutationConfig: {
      onError: (err) => {
        toast.error('Gagal menyimpan jam kerja', {
          description: err?.message || null,
        });
      },
    },
  });

  // Local state for hours and minutes inputs initialized from server data
  const [hours, setHours] = useState<number | null>(initialHours);
  const [minutes, setMinutes] = useState<number | null>(initialMinutes);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced upsert
  const debouncedUpsert = useCallback(
    (newHours: number | null, newMinutes: number | null) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // Only save if at least one field has a value
      if (newHours === null && newMinutes === null) return;
      if (!userId) return;

      const totalMinutes = (newHours ?? 0) * 60 + (newMinutes ?? 0);

      debounceRef.current = setTimeout(() => {
        upsertWorkTime({
          user_id: userId,
          date: today,
          working_minute: totalMinutes,
        });
      }, DEBOUNCE_MS);
    },
    [userId, today, upsertWorkTime],
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleHoursChange = (value: number | null) => {
    // Clamp hours: when hours is at max, reset minutes to 0 if needed
    const clampedHours = value !== null ? Math.min(value, MAX_HOURS) : null;
    let newMinutes = minutes;

    if (clampedHours !== null && clampedHours >= MAX_HOURS) {
      newMinutes = 0;
    }

    setHours(clampedHours);
    setMinutes(newMinutes);
    debouncedUpsert(clampedHours, newMinutes);
  };

  const handleMinutesChange = (value: number | null) => {
    // If hours is at max, don't allow adding minutes
    if (hours !== null && hours >= MAX_HOURS) {
      setMinutes(0);
      return;
    }

    setMinutes(value);
    debouncedUpsert(hours, value);
  };

  return (
    <FieldGroup className="grid grid-cols-2 gap-4">
      {/* Hours */}
      <Field>
        <FieldLabel>Jam</FieldLabel>
        <NumberField
          size="sm"
          value={hours}
          onValueChange={handleHoursChange}
          min={0}
          max={MAX_HOURS}
        >
          <NumberFieldGroup>
            <NumberFieldInput placeholder="-" />
            <div className="bg-muted/30 rounded-r-full flex shrink-0 flex-col overflow-hidden">
              <NumberFieldIncrement className="hover:bg-accent focus-visible:bg-accent flex h-3.5 w-full flex-1 shrink-0 items-center rounded-none! px-1.5 leading-none">
                <ChevronUpIcon className="size-3.5" />
              </NumberFieldIncrement>
              <NumberFieldDecrement className="hover:bg-accent focus-visible:bg-accent flex h-3.5 w-full flex-1 shrink-0 items-center rounded-none! px-1.5 leading-none">
                <ChevronDownIcon className="size-3.5" />
              </NumberFieldDecrement>
            </div>
          </NumberFieldGroup>
        </NumberField>
      </Field>

      {/* Minutes */}
      <Field>
        <FieldLabel>Menit</FieldLabel>
        <NumberField
          size="sm"
          value={minutes}
          onValueChange={handleMinutesChange}
          min={0}
          max={MAX_MINUTES}
        >
          <NumberFieldGroup>
            <NumberFieldInput placeholder="-" />
            <div className="bg-muted/30 rounded-r-full flex shrink-0 flex-col overflow-hidden">
              <NumberFieldIncrement className="hover:bg-accent focus-visible:bg-accent flex h-3.5 w-full flex-1 shrink-0 items-center rounded-none! px-1.5 leading-none">
                <ChevronUpIcon className="size-3.5" />
              </NumberFieldIncrement>
              <NumberFieldDecrement className="hover:bg-accent focus-visible:bg-accent flex h-3.5 w-full flex-1 shrink-0 items-center rounded-none! px-1.5 leading-none">
                <ChevronDownIcon className="size-3.5" />
              </NumberFieldDecrement>
            </div>
          </NumberFieldGroup>
        </NumberField>
      </Field>
    </FieldGroup>
  );
};

const WorktimeInput = () => {
  const { data: workTime, isLoading } = useFetchWorkTime();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Spinner className="size-4" />
      </div>
    );
  }

  const initialHours = workTime
    ? Math.floor(workTime.working_minute / 60)
    : null;
  const initialMinutes = workTime ? workTime.working_minute % 60 : null;

  return (
    <WorktimeFields
      key={workTime?.id ?? 'empty'}
      initialHours={initialHours}
      initialMinutes={initialMinutes}
    />
  );
};

export default WorktimeInput;
