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
// import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Link } from 'react-router';
import { useFetchDivisions } from '@/features/divisions/api/fetchDivisions';
import { useFetchRoles } from '@/features/roles/api/fetchRoles';
import InputField from '@/components/shared/form/InputField';
import PasswordField from '@/components/shared/form/PasswordField';
import SelectField from '@/components/shared/form/SelectField';
import AvatarUpload from '@/components/shared/form/AvatarUpload';
// import useAuthStore from '@/stores/authStore';
// import { useFilterStore } from '@/stores/filterStore';
import { registerSchema, type RegisterInput } from '../schemas/authSchemas';
// import { useRegister } from '../hooks/useRegister';

const RegisterForm = () => {
  // Ambil data divisi dan jabatan
  const { data: divisions } = useFetchDivisions();
  const { data: roles } = useFetchRoles();

  const form = useForm<RegisterInput>({
    // mode: 'onTouched',
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: '',
      nik: '',
      division_id: undefined,
      role_id: undefined,
      email: '',
      password: '',
      confirm_password: '',
    },
  });

  // const { mutateAsync: registerMutation } = useRegister();

  // const login = useAuthStore((state) => state.login);
  // const navigate = useNavigate();

  // const setSelectedUserId = useFilterStore((state) => state.setSelectedUserId);

  const onSubmit = (data: RegisterInput) => {
    console.log(data);
    return;
  };

  // const onSubmit = (data) => {
  // const payload = { ...data, name: data.full_name.split(' ')[0] };
  // const formData = new FormData();
  // Object.entries(data).forEach(([key, value]) => {
  //   if (value !== null && value !== undefined) {
  //     formData.append(key, value);
  //   }
  // });

  // toast.promise(registerMutation(payload), {
  // loading: 'Sedang membuat akun...',
  // success: () => {
  // const { user, access_token, refresh_token } = res.data;
  // login(user, access_token, refresh_token);
  // setSelectedUserId(user.id);
  // navigate('/verify');
  // return {
  // message: 'Akun Anda berhasil dibuat',
  // description: `Selamat datang, ${user.profile.name}!`,
  // };
  // },
  // error: (err) => {
  //   return {
  //     message: 'Akun Anda gagal dibuat',
  //     description: err?.message || null,
  //   };
  // },
  // });
  // };

  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Buat Akun Baru</CardTitle>
        <CardDescription>
          Silakan isi informasi di bawah ini untuk membuat akun anda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
              Informasi Pribadi
            </FieldSeparator>
            {/* Avatar */}
            <AvatarUpload
              maxSize={1 * 1024 * 1024}
              onFileChange={(fileWrapper) => {
                const file = fileWrapper?.file;
                const isFile = file instanceof File;
                form.setValue('avatar', isFile ? file : undefined);
              }}
            />
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
              label="Password"
              required
              placeholder="Masukkan password anda"
              description="Password minimal memiliki 8 karakter."
            />
            {/* Confirm Password */}
            <PasswordField
              name="confirm_password"
              control={form.control}
              label="Konfirmasi Password"
              required
              placeholder="Masukkan kembali password anda"
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
