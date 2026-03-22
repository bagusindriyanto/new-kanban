import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useId } from 'react';
import { Controller } from 'react-hook-form';

const InputField = ({
  name,
  control,
  label,
  type = 'text',
  required = false,
  placeholder,
  autoComplete,
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
          <Input
            {...field}
            id={id}
            type={type}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            autoComplete={autoComplete}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default InputField;
