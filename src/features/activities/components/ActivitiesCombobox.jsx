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

const ActivitiesCombobox = ({ control, className }) => {
  const id = useId();
  const { data: contents, isLoading } = useFetchActivities();
  const { mutateAsync, isPending } = useAddActivity();

  const onSubmit = (data) => {
    toast.promise(mutateAsync(data), {
      loading: 'Sedang menambahkan aktivitas...',
      success: () => {
        return 'Aktivitas berhasil ditambahkan';
      },
      error: (err) => {
        return {
          message: 'Aktivitas gagal ditambahkan',
          description: err.response?.data?.message || null,
        };
      },
    });
  };

  return (
    <Controller
      name="content"
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
              inputValue={field.value || ''}
              onInputValueChange={field.onChange}
              autoHighlight
              items={contents}
              value={selectedContent}
              onValueChange={(content) => {
                if (content) field.onChange(content.name);
              }}
              itemToStringLabel={(content) => String(content.name)}
              itemToStringValue={(content) => String(content.name)}
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
                        onSubmit({ activity: field.value });
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
                  {(content) => (
                    <ComboboxItem key={String(content.name)} value={content}>
                      {String(content.name)}
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
