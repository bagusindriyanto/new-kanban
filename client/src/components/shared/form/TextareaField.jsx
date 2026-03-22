import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import { useId } from 'react';
import { Controller } from 'react-hook-form';

const TextareaField = ({
  name,
  control,
  label,
  required = false,
  placeholder,
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
          <InputGroup>
            <InputGroupTextarea
              {...field}
              id={id}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              className="resize-none"
            />
            <InputGroupAddon align="block-end">
              <InputGroupText className="tabular-nums">
                {field.value?.length || 0}/100 karakter
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default TextareaField;
