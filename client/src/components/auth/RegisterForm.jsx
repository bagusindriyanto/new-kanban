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
import { toast } from 'sonner';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../ui/input-group';
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
import InputField from '../shared/form/InputField';
import PasswordField from '../shared/form/PasswordField';
import SelectField from '../shared/form/SelectField';
import AvatarUpload from '../shared/form/AvatarUpload';

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
    division_id: z.number('Mohon pilih divisi anda.'),
    role_id: z.number('Mohon pilih jabatan anda.'),
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
  // Ambil data divisi dan jabatan
  const { data: divisions } = useFetchDivisions();
  const { data: roles } = useFetchRoles();

  const form = useForm({
    mode: 'onTouched',
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: '',
      nik: '',
      division_id: null,
      role_id: null,
      email: '',
      password: '',
      confirm_password: '',
    },
  });

  const navigate = useNavigate();

  const onSubmit = (data) => {
    toast.promise(api.post('/auth/register', data), {
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
    <Card className="mx-auto w-full max-w-xl">
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
              <InputField
                name="full_name"
                control={form.control}
                label="Nama Lengkap"
                required
                placeholder="Masukkan nama lengkap anda"
                autoComplete="off"
                className="col-span-2"
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
                        placeholder="1234"
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
              <SelectField
                name="division_id"
                control={form.control}
                label="Divisi"
                required
                items={divisions}
                valueKey="id"
                labelKey="name"
                placeholder="Pilih divisi"
              />
              {/* Jabatan */}
              <SelectField
                name="role_id"
                control={form.control}
                label="Jabatan"
                required
                items={roles}
                valueKey="id"
                labelKey="name"
                placeholder="Pilih jabatan"
              />
            </Field>
            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
              Informasi Akun
            </FieldSeparator>
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
              label="Kata Sandi"
              required
              placeholder="Masukkan kata sandi anda"
              description="Kata sandi minimal memiliki 8 karakter."
            />
            {/* Confirm Password */}
            <PasswordField
              name="confirm_password"
              control={form.control}
              label="Konfirmasi Kata Sandi"
              required
            />
            <Field>
              <Button type="submit">Daftar</Button>
              <FieldDescription className="text-center">
                Sudah memiliki akun? <Link to="/login">Login di sini</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
