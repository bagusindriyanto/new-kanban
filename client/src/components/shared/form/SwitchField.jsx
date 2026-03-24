import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { useId } from 'react';
import { Controller } from 'react-hook-form';

const SwitchField = ({
  name,
  control,
  orientation = 'horizontal',
  label,
  className,
  disabled,
}) => {
  const id = useId();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field
          data-invalid={fieldState.invalid}
          orientation={orientation}
          className={className}
          data-disabled={disabled}
        >
          <Switch
            id={id}
            name={field.name}
            checked={field.value}
            onCheckedChange={field.onChange}
            aria-invalid={fieldState.invalid}
            disabled={disabled}
          />
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default SwitchField;
