import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Controller } from 'react-hook-form';
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field';
import { useId } from 'react';

const NumberInputField = ({
  name,
  control,
  label,
  required,
  disabled,
  min,
  max,
  className,
}) => {
  const id = useId();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          <FieldLabel htmlFor={id} className="gap-0.5">
            {label}
            {required && <span className="text-red-500">*</span>}
          </FieldLabel>
          <NumberField
            id={id}
            value={field.value}
            onValueChange={(value) => field.onChange(value)}
            min={min}
            max={max}
            disabled={disabled}
          >
            <NumberFieldGroup aria-invalid={fieldState.invalid}>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldGroup>
          </NumberField>
          {fieldState.error && (
            <FieldError>{fieldState.error?.message}</FieldError>
          )}
        </Field>
      )}
    />
  );
};

export default NumberInputField;
