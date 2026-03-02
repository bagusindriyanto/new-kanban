import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '../ui/input-group';
import { Eye, EyeClosed } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { api } from '@/lib/api';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const formSchema = z
  .object({
    username: z.string().min(3, 'Username minimal memiliki 3 karakter.'),
    full_name: z.string().min(1, 'Mohon isi nama lengkap anda.'),
    name: z.string().min(1, 'Mohon isi nama panggilan anda.'),
    nik: z.string().min(1, 'Mohon isi NIK anda.'),
    role: z.enum(['supervisor', 'staff'], {
      error: 'Mohon pilih jabatan anda.',
    }),
    password: z.string().min(1, 'Mohon isi kata sandi.'),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Kata sandi tidak sesuai.',
    path: ['confirmPassword'], // path of error
  });

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { username: '', password: '' },
  });

  const navigate = useNavigate();

  const onSubmit = (data) => {
    toast.promise(api.post('/pics.php', data), {
      loading: 'Sedang membuat akun...',
      success: () => {
        navigate('/login');
        return {
          message: 'Berhasil membuat akun!',
          description: 'Silahkan login dengan akun yang anda daftarkan.',
        };
      },
      error: (err) => {
        return {
          message: err.response?.data?.message || 'Gagal membuat akun.',
          description: err.response?.data?.error_detail || null,
        };
      },
    });
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Buat Akun Baru</CardTitle>
        <CardDescription>
          Silahkan isi informasi di bawah ini untuk membuat akun anda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field className="grid grid-cols-2 gap-4">
              {/* Nama Lengkap */}
              <Controller
                name="full_name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="register-full-name">
                      Nama Lengkap
                    </FieldLabel>
                    <Input {...field} id="register-full-name" type="text" />
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
                    <FieldLabel htmlFor="register-name">
                      Nama Panggilan
                    </FieldLabel>
                    <Input {...field} id="register-name" type="text" />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </Field>
            <Field className="grid grid-cols-2 gap-4">
              {/* NIK */}
              <Controller
                name="nik"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="register-nik">NIK</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        MGM -
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        id="register-nik"
                        type="text"
                        inputmode="numeric"
                      />
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="role"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="register-role" className="gap-0.5">
                      Jabatan<span className="text-red-500">*</span>
                    </FieldLabel>
                    <Select
                      name={field.name}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger
                        id="register-role"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Pilih jabatan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Jabatan</SelectLabel>
                          <SelectItem value="supervisor">Supervisor</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </Field>
            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
              Akun
            </FieldSeparator>
            {/* Username */}
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-username">Username</FieldLabel>
                  <Input {...field} id="register-username" type="text" />
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
                  <FieldLabel htmlFor="register-password">Password</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      id="register-password"
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
                </Field>
              )}
            />
            {/* Confirm Password */}
            <Controller
              name="confirm_password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-confirm-password">
                    Konfirmasi Password
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="register-confirm-password"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? <EyeClosed /> : <Eye />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Field>
              <Button type="submit">Daftar</Button>
              <Button asChild variant="outline">
                <Link to="/login">Saya sudah memiliki akun</Link>
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
