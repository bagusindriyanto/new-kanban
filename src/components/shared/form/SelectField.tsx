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
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

type SelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TItem extends Record<string, unknown> = Record<string, unknown>,
> = {
  name: TName;
  control: Control<TFieldValues>;
  label: string;
  required?: boolean;
  disabled?: boolean;
  items: TItem[] | undefined;
  valueKey: keyof TItem;
  labelKey: keyof TItem;
  placeholder?: string;
  className?: string;
};

const SelectField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TItem extends Record<string, unknown> = Record<string, unknown>,
>({
  name,
  control,
  label,
  required,
  disabled,
  items = [],
  valueKey,
  labelKey,
  placeholder,
  className,
}: SelectFieldProps<TFieldValues, TName, TItem>) => {
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

        const formattedItems = items?.map((item) => ({
          label: String(item[labelKey]),
          value: item,
        }));

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
              items={formattedItems}
              value={selectedItem}
              onValueChange={(item: TItem | null) => {
                field.onChange(item ? item[valueKey] : null);
              }}
              itemToStringLabel={(item: TItem | null) => (item ? String(item[labelKey]) : '')}
              itemToStringValue={(item: TItem | null) => (item ? String(item[valueKey]) : '')}
            >
              <SelectTrigger
                id={id}
                aria-invalid={fieldState.invalid}
                disabled={disabled}
              >
                <SelectValue placeholder={placeholder}>
                  {selectedItem ? String(selectedItem[labelKey]) : null}
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
