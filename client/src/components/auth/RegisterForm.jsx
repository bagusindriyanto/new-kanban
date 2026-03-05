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
import { useFetchDivisions } from '@/api/fetchDivisions';
import { useFetchRoles } from '@/api/fetchRoles';

const formSchema = z
  .object({
    full_name: z.string().min(1, 'Mohon isi nama lengkap anda.'),
    name: z.string().optional(),
    nik: z
      .string()
      .min(1, 'Mohon isi NIK anda.')
      .refine((val) => /^[0-9]+$/.test(val), {
        error: 'NIK hanya boleh mengandung angka.',
      }),
    division_id: z.string().min(1, 'Mohon pilih divisi anda.'),
    role_id: z.string().min(1, 'Mohon pilih jabatan anda.'),
    email: z
      .email('Mohon isi email dengan benar.')
      .min(1, 'Mohon isi email anda.'),
    password: z
      .string()
      .min(8, 'Kata sandi tidak boleh kurang dari 8 karakter.'),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Kata sandi tidak sesuai.',
    path: ['confirm_password'],
  });

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Ambil data divisi dan jabatan
  const { data: divisions } = useFetchDivisions();
  const { data: roles } = useFetchRoles();

  const form = useForm({
    mode: 'onTouched',
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: '',
      nik: '',
      division_id: '',
      role_id: '',
      email: '',
      password: '',
      confirm_password: '',
    },
  });

  const navigate = useNavigate();

  const onSubmit = (data) => {
    toast.promise(api.post('/register.php', data), {
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
            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
              Informasi Pribadi
            </FieldSeparator>
            <Field className="grid grid-cols-2 gap-4">
              {/* Nama Lengkap */}
              <Controller
                name="full_name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="col-span-2"
                  >
                    <FieldLabel
                      htmlFor="register-full-name"
                      className="gap-0.5"
                    >
                      Nama Lengkap<span className="text-red-500">*</span>
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
              {/* NIK */}
              <Controller
                name="nik"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="register-nik" className="gap-0.5">
                      NIK<span className="text-red-500">*</span>
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        MGM -
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        id="register-nik"
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
              {/* Divisi */}
              <Controller
                name="division_id"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="register-division" className="gap-0.5">
                      Divisi<span className="text-red-500">*</span>
                    </FieldLabel>
                    <Select
                      name={field.name}
                      onValueChange={field.onChange}
                      value={field.value ? String(field.value) : ''}
                    >
                      <SelectTrigger
                        id="register-division"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Pilih divisi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Divisi</SelectLabel>
                          {divisions?.map((division) => (
                            <SelectItem
                              key={division.id}
                              value={String(division.id)}
                            >
                              {division.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Jabatan */}
              <Controller
                name="role_id"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="register-role" className="gap-0.5">
                      Jabatan<span className="text-red-500">*</span>
                    </FieldLabel>
                    <Select
                      name={field.name}
                      onValueChange={field.onChange}
                      value={field.value ? String(field.value) : ''}
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
                          {roles?.map((role) => (
                            <SelectItem key={role.id} value={String(role.id)}>
                              {role.name}
                            </SelectItem>
                          ))}
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
              Informasi Akun
            </FieldSeparator>
            {/* Email */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-email" className="gap-0.5">
                    Email<span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input {...field} id="register-email" type="email" />
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
                  <FieldLabel htmlFor="register-password" className="gap-0.5">
                    Kata Sandi<span className="text-red-500">*</span>
                  </FieldLabel>
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
                  <FieldDescription>
                    Kata sandi minimal memiliki 8 karakter.
                  </FieldDescription>
                </Field>
              )}
            />
            {/* Confirm Password */}
            <Controller
              name="confirm_password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="register-confirm-password"
                    className="gap-0.5"
                  >
                    Konfirmasi Kata Sandi<span className="text-red-500">*</span>
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
              <FieldDescription className="text-center">
                Sudah memiliki akun? <Link to="/login">Sign in di sini</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
