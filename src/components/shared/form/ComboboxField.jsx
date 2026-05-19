import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { useId } from 'react';
import { Controller } from 'react-hook-form';

const ComboboxField = ({
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
            <Combobox
              autoHighlight
              items={items}
              value={selectedItem}
              onValueChange={(item) => {
                field.onChange(item ? item[valueKey] : null);
              }}
              itemToStringLabel={(item) => String(item[labelKey])}
              itemToStringValue={(item) => String(item[valueKey])}
            >
              <ComboboxInput
                id={id}
                aria-invalid={fieldState.invalid}
                placeholder={placeholder}
                disabled={disabled}
                showClear
              />
              <ComboboxContent>
                <ComboboxEmpty>Data tidak ditemukan.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={String(item[valueKey])} value={item}>
                      {String(item[labelKey])}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
};

export default ComboboxField;
