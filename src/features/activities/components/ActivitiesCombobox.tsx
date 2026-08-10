import { useFetchActivities } from '@/features/activities/api/fetchActivities';
import { useAddActivity } from '@/features/activities/api/addActivity';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { useId } from 'react';
import { Controller } from 'react-hook-form';
import { PlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import type { ActivityInsert } from '@/types/activity';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import type { Activity } from '../api/query';

type ActivitiesComboboxProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  name: TName;
  control: Control<TFieldValues>;
  className?: string;
};

const ActivitiesCombobox = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  control,
  className,
}: ActivitiesComboboxProps<TFieldValues, TName>) => {
  const id = useId();
  const { data: contents, isLoading } = useFetchActivities();
  const { mutateAsync, isPending } = useAddActivity();

  const onSubmit = (data: ActivityInsert) => {
    toast.promise(mutateAsync(data), {
      loading: 'Sedang menambahkan aktivitas...',
      success: () => {
        return 'Aktivitas berhasil ditambahkan';
      },
      error: (err) => {
        return {
          message: 'Aktivitas gagal ditambahkan',
          description: err.message || null,
        };
      },
    });
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selectedContent =
          contents?.find(
            (content) => String(content.name) === String(field.value),
          ) ?? null;

        return (
          <Field
            data-invalid={fieldState.invalid}
            className={className}
            data-disabled={isLoading}
          >
            <FieldLabel htmlFor={id} className="gap-0.5">
              Aktivitas <span className="text-red-500">*</span>
            </FieldLabel>
            <Combobox
              autoHighlight
              items={contents}
              value={selectedContent}
              inputValue={field.value || ''}
              onInputValueChange={field.onChange}
              onValueChange={(content) => {
                if (content) field.onChange(content.name);
              }}
              itemToStringLabel={(content) => content.name}
              itemToStringValue={(content) => content.name}
            >
              <ComboboxInput
                id={id}
                aria-invalid={fieldState.invalid}
                placeholder="Cari atau buat aktivitas"
                disabled={isLoading}
                showClear
              />
              <ComboboxContent>
                <ComboboxEmpty className="flex-col items-center justify-center gap-3 p-4">
                  <span className="text-sm text-muted-foreground">
                    &quot;{field.value}&quot; tidak ditemukan.
                  </span>
                  {field.value && (
                    <Button
                      type="button"
                      size="sm"
                      disabled={isPending}
                      onClick={() => {
                        onSubmit({ name: field.value });
                      }}
                    >
                      {isPending ? (
                        <>
                          <Spinner data-icon="inline-start" />
                          Menambahkan...
                        </>
                      ) : (
                        <>
                          <PlusIcon data-icon="inline-start" />
                          Tambahkan Aktivitas
                        </>
                      )}
                    </Button>
                  )}
                </ComboboxEmpty>
                <ComboboxList>
                  {(content: Activity) => (
                    <ComboboxItem key={content.name} value={content}>
                      {content.name}
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

export default ActivitiesCombobox;
