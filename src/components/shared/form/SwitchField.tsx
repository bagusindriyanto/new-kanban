import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { useId, type ComponentPropsWithoutRef } from 'react';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

type SwitchFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
  control: Control<TFieldValues>;
  label?: string;
  orientation?: 'vertical' | 'horizontal' | 'responsive';
  className?: string;
} & Omit<ComponentPropsWithoutRef<typeof Switch>, 'name' | 'className'>;

const SwitchField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  orientation = 'horizontal',
  label,
  className,
  disabled,
  ...props
}: SwitchFieldProps<TFieldValues, TName>) => {
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
            {...props}
            id={id}
            name={field.name}
            checked={field.value}
            onCheckedChange={field.onChange}
            aria-invalid={fieldState.invalid}
            disabled={disabled}
          />
          {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default SwitchField;
