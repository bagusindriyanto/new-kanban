import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { useState, useId } from 'react';
import { Controller } from 'react-hook-form';
import { Eye, EyeClosed } from 'lucide-react';

const PasswordField = ({
  name,
  control,
  label,
  isRequired = false,
  placeholder,
  description,
  className,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const id = useId();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          <FieldLabel htmlFor={id} className="gap-0.5">
            {label}
            {isRequired && <span className="text-red-500">*</span>}
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              {...field}
              id={id}
              type={showPassword ? 'text' : 'password'}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeClosed /> : <Eye />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          {description && <FieldDescription>{description}</FieldDescription>}
        </Field>
      )}
    />
  );
};

export default PasswordField;
