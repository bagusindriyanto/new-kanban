import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';
import AvatarUpload from '@/components/shared/form/AvatarUpload';
import InputField from '@/components/shared/form/InputField';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Button } from '@/components/ui/button';
import { useUpdateProfile } from '@/features/auth/api/updateProfile';
import { useFetchCurrentUser } from '@/features/users/api/fetchCurrentUser';
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from '../schemas/updateUserSchemas';

const UpdateProfileForm = () => {
  const { data: currentUser } = useFetchCurrentUser();
  const defaultAvatar = currentUser?.avatar ?? undefined;

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      full_name: '',
      name: '',
      nik: '',
      delete_avatar: false,
    },
  });

  // Populate form dengan data currentUser setelah data tersedia
  useEffect(() => {
    if (!currentUser) return;
    form.reset({
      full_name: currentUser.full_name ?? '',
      name: currentUser.name ?? '',
      nik: currentUser.nik ?? '',
    });
  }, [currentUser, form]);

  const { mutateAsync: updateProfileMutate, isPending } = useUpdateProfile();

  const onSubmit = (data: UpdateProfileInput) => {
    const payload = {
      ...data,
      name: data.name || data.full_name.split(' ')[0],
    };

    toast.promise(updateProfileMutate(payload), {
      loading: 'Sedang memperbarui akun...',
      success: () => {
        return 'Akun Anda berhasil diperbarui';
      },
      error: (err: Error) => {
        return {
          message: 'Akun Anda gagal diperbarui',
          description: err?.message || null,
        };
      },
    });
  };

  return (
    <Card>
      <CardContent>
        <form
          id="update-profile-account"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldSet className="grid gap-5 lg:grid-cols-[0.75fr_2fr] lg:gap-6 items-center">
            {/* Avatar */}
            <AvatarUpload
              defaultAvatar={defaultAvatar}
              onFileChange={(fileWrapper) => {
                const file = fileWrapper?.file;
                const isFile = file instanceof File;
                form.setValue('avatar', isFile ? file : null);

                if (isFile) {
                  form.setValue('delete_avatar', false);
                }
              }}
              onDeleteAvatar={() => {
                form.setValue('avatar', null);
                form.setValue('delete_avatar', true);
              }}
            />
            <FieldGroup>
              <InputField
                name="full_name"
                control={form.control}
                label="Nama Lengkap"
                required
                placeholder="Masukkan nama lengkap anda"
                autoComplete="off"
                className="lg:col-span-2"
              />
              {/* Nama Panggilan */}
              <InputField
                name="name"
                control={form.control}
                label="Nama Panggilan"
                placeholder="Masukkan nama panggilan anda"
                autoComplete="off"
              />
              {/* NIK */}
              <Controller
                name="nik"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="settings-account-nik"
                      className="gap-0.5"
                    >
                      NIK<span className="text-red-500">*</span>
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        MGM -
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        id="settings-account-nik"
                        type="text"
                        inputMode="numeric"
                        placeholder="1234"
                      />
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
      <CardFooter className="justify-end">
        <Button
          type="submit"
          form="update-profile-account"
          disabled={isPending}
        >
          {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UpdateProfileForm;
