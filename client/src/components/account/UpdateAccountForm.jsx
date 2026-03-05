import { Card, CardContent } from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '../ui/field';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import z from 'zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuth from '@/stores/authStore';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '../ui/input-group';
import { Eye } from 'lucide-react';
import { EyeClosed } from 'lucide-react';
import { refreshData } from '@/utils/refreshData';

const formSchema = z.object({
  full_name: z.string().min(1, 'Mohon isi nama lengkap anda.'),
  name: z.string().optional(),
  nik: z
    .string()
    .min(1, 'Mohon isi NIK anda.')
    .refine((val) => /^[0-9]+$/.test(val), {
      error: 'NIK hanya boleh mengandung angka.',
    }),
  email: z
    .email('Mohon isi email dengan benar.')
    .min(1, 'Mohon isi email anda.'),
  password: z.string().min(8, 'Kata sandi tidak boleh kurang dari 8 karakter.'),
});

const UpdateAccountForm = () => {
  const user = useAuth((state) => state.user);
  const setUser = useAuth((state) => state.setUser);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    mode: 'onTouched',
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: user.full_name,
      name: user.name,
      nik: user.nik,
      email: user.email,
      password: '',
    },
  });

  const onSubmit = (data) => {
    toast.promise(api.patch('/users.php', data), {
      loading: 'Sedang memperbarui akun...',
      success: (res) => {
        refreshData();
        setUser(res.data.user);
        form.reset({
          full_name: '',
          name: '',
          nik: '',
          email: '',
          password: '',
        });
        return 'Berhasil mengubah data!';
      },
      error: (err) => {
        return {
          message: err.response?.data?.message || 'Gagal mengubah data.',
          description: err.response?.data?.error_detail || null,
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
            <Field className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
              <Controller
                control={form.control}
                name="full_name"
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="col-span-1 lg:col-span-2"
                  >
                    <FieldLabel
                      htmlFor="settings-account-full-name"
                      className="gap-0.5"
                    >
                      Nama Lengkap<span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id="settings-account-full-name"
                      type="text"
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Nama Panggilan */}
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="settings-account-name">
                      Nama Panggilan
                    </FieldLabel>
                    <Input {...field} id="settings-account-name" type="text" />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
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
            <Field className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 mb-8 mt-2">
              {/* Email */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="settings-accounts-email"
                      className="gap-0.5"
                    >
                      Email<span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="settings-accounts-email"
                      type="email"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Password */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="settings-accounts-password"
                      className="gap-0.5"
                    >
                      Kata Sandi<span className="text-red-500">*</span>
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        id="settings-accounts-password"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeClosed /> : <Eye />}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                    <FieldDescription>
                      Kata sandi minimal memiliki 8 karakter.
                    </FieldDescription>
                  </Field>
                )}
              />
            </Field>
            <div className="mt-6 flex justify-end gap-3 border-t border-border pt-6">
              <Button
                variant="outline"
                type="reset"
                onClick={() => {
                  form.reset({
                    full_name: '',
                    name: '',
                    nik: '',
                    email: '',
                    password: '',
                  });
                  setShowPassword(false);
                }}
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
