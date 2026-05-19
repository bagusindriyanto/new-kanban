import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { useId } from 'react';
import { Controller } from 'react-hook-form';

const SelectField = ({
  name,
  control,
  label,
  required,
  disabled,
  items,
  valueKey,
  labelKey,
  placeholder,
  className,
}) => {
  const id = useId();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selectedItem =
          items?.find(
            (item) => String(item[valueKey]) === String(field.value),
          ) ?? null;

        return (
          <Field
            data-invalid={fieldState.invalid}
            className={className}
            data-disabled={disabled}
          >
            <FieldLabel htmlFor={id} className="gap-0.5">
              {label}
              {required && <span className="text-red-500">*</span>}
            </FieldLabel>
            <Select
              items={items}
              value={selectedItem}
              onValueChange={(item) => {
                field.onChange(item ? item[valueKey] : null);
              }}
              itemToStringLabel={(item) => String(item[labelKey])}
              itemToStringValue={(item) => String(item[valueKey])}
            >
              <SelectTrigger
                id={id}
                aria-invalid={fieldState.invalid}
                disabled={disabled}
              >
                <SelectValue placeholder={placeholder}>
                  {
                    items?.find(
                      (item) => String(item[valueKey]) === String(field.value),
                    )?.label
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {items?.map((item) => (
                    <SelectItem key={String(item[valueKey])} value={item}>
                      {String(item[labelKey])}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
};

export default SelectField;
