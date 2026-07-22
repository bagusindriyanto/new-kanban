import { useEffect } from 'react';
import useAuthStore from '@/stores/authStore';
import z from 'zod';
import { getAvatarURL } from '../utils/getAvatarURL';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { api } from '@/lib/axios';
import { refreshData } from '@/utils/refreshData';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import AvatarUpload from '@/components/shared/form/AvatarUpload';
import InputField from '@/components/shared/form/InputField';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import PasswordField from '@/components/shared/form/PasswordField';
import { Button } from '@/components/ui/button';
import { useFetchProfile } from '@/features/auth/api/fetchProfile';
import { useUpdateProfile } from '@/features/auth/api/updateProfile';

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const formSchema = z.object({
  full_name: z.string().min(1, 'Mohon isi nama lengkap anda.').trim(),
  name: z.string().trim().optional(),
  nik: z
    .string()
    .min(1, 'Mohon isi NIK anda.')
    .refine((val) => /^[0-9]+$/.test(val), {
      error: 'NIK hanya boleh mengandung angka.',
    }),
  avatar: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      'Ukuran file maksimal 1MB',
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Format harus JPG, PNG, atau WebP',
    ),
});

const UpdateProfileForm = () => {
  const { data: currentUser } = useFetchProfile();
  const defaultAvatar = currentUser?.avatar;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: '',
      name: '',
      nik: '',
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
  }, [currentUser]);

  const { mutateAsync: updateProfileMutate, isPending } = useUpdateProfile();

  const onSubmit = (data) => {
    const payload = { ...data, name: data.full_name.split(' ')[0] };

    toast.promise(updateProfileMutate(payload), {
      loading: 'Sedang memperbarui akun...',
      success: () => {
        return 'Akun Anda berhasil diperbarui';
      },
      error: (err) => {
        return {
          message: 'Akun Anda gagal diperbarui',
          description: err.response?.data?.message || null,
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
          <FieldGroup>
            {/* Avatar */}
            <AvatarUpload
              name="avatar"
              defaultAvatar={defaultAvatar}
              onFileChange={(fileWrapper) =>
                form.setValue('avatar', fileWrapper?.file || null)
              }
            />
            <Field className="grid gap-5 lg:grid-cols-2 lg:gap-6">
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
            </Field>
          </FieldGroup>
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
