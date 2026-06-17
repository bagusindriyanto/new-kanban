import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field';
import { toast } from 'sonner';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import useAuthStore from '@/stores/authStore';
import { Link, useNavigate } from 'react-router';
import { api } from '@/lib/axios';
import useFilterStore from '@/stores/filterStore';
import InputField from '@/components/shared/form/InputField';
import PasswordField from '@/components/shared/form/PasswordField';

const formSchema = z.object({
  email: z
    .email('Mohon isi email dengan benar.')
    .min(1, 'Mohon isi email anda.'),
  password: z.string().min(1, 'Mohon isi kata sandi anda.'),
});

const LoginForm = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const setSelectedUserId = useFilterStore((state) => state.setSelectedUserId);

  const onSubmit = (data) => {
    toast.promise(api.post('/auth/login', data), {
      loading: 'Sedang memproses login...',
      success: (res) => {
        const { user, access_token, refresh_token } = res.data;
        login(user, access_token, refresh_token);
        setSelectedUserId(user.id);
        navigate('/');
        return {
          message: 'Login berhasil',
          description: `Selamat datang, ${user.profile.name}!`,
        };
      },
      error: (err) => {
        return {
          message: 'Login gagal',
          description: err.response?.data?.message || null,
        };
      },
    });
  };

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl tracking-tight">
          Selamat Datang!
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <InputField
              name="email"
              control={form.control}
              label="Email"
              type="email"
            />
            <PasswordField
              name="password"
              control={form.control}
              label="Kata Sandi"
            />
            <Field>
              <Button type="submit">Login</Button>
              <FieldDescription className="text-center">
                Belum memiliki akun? <Link to="/register">Sign up di sini</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
