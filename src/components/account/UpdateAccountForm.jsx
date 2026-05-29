import { Card, CardContent } from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '../ui/field';
import { Button } from '../ui/button';
import z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuthStore from '@/stores/authStore';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../ui/input-group';
import { refreshData } from '@/utils/refreshData';
import InputField from '../shared/form/InputField';
import PasswordField from '../shared/form/PasswordField';
import AvatarUpload from '../shared/form/AvatarUpload';
import { getAvatarURL } from '@/utils/getAvatarURL';

const formSchema = z.object({
  full_name: z.string().min(1, 'Mohon isi nama lengkap anda.'),
  name: z.string().optional(),
  nik: z
    .string()
    .min(1, 'Mohon isi NIK anda.')
    .refine((val) => /^[0-9]+$/.test(val), {
      error: 'NIK hanya boleh mengandung angka.',
    }),
  avatar: z.instanceof(File).optional(),
  email: z
    .email('Mohon isi email dengan benar.')
    .min(1, 'Mohon isi email anda.'),
  password: z.string().min(8, 'Kata sandi tidak boleh kurang dari 8 karakter.'),
});

const UpdateAccountForm = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const defaultAvatar = getAvatarURL(user.pic.avatar);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: user.pic.full_name,
      name: user.pic.name,
      nik: user.pic.nik,
      email: user.email,
      password: '',
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    toast.promise(api.post('/account', formData), {
      loading: 'Sedang memperbarui akun...',
      success: (res) => {
        refreshData();
        setUser(res.data.user);
        form.reset({
          full_name: '',
          name: '',
          nik: '',
          avatar: null,
          email: '',
          password: '',
        });
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
              Informasi Pribadi
            </FieldSeparator>
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
            <FieldSeparator className="mt-6 *:data-[slot=field-separator-content]:bg-card">
              Informasi Akun
            </FieldSeparator>
            <Field className="grid gap-5 mt-2 mb-6 lg:grid-cols-2 lg:gap-6">
              {/* Email */}
              <InputField
                name="email"
                control={form.control}
                label="Email"
                type="email"
                required
                placeholder="Masukkan email anda"
                autoComplete="off"
              />
              {/* Password */}
              <PasswordField
                name="password"
                control={form.control}
                label="Kata Sandi Baru"
                required
                placeholder="Masukkan kata sandi yang baru"
                description="Kata sandi minimal memiliki 8 karakter."
              />
            </Field>
            <div className="flex gap-2 justify-end pt-6 border-t">
              <Button
                variant="outline"
                type="reset"
                onClick={() =>
                  form.reset({
                    full_name: '',
                    name: '',
                    nik: '',
                    email: '',
                    password: '',
                  })
                }
              >
                Reset Form
              </Button>
              <Button type="submit">Perbarui Akun</Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpdateAccountForm;
