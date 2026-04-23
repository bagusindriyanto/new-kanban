import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field';
import { toast } from 'sonner';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import useAuthStore from '@/stores/authStore';
import { Link, useNavigate } from 'react-router';
import { api } from '@/lib/api';
import useFilter from '@/stores/filterStore';
import InputField from '../shared/form/InputField';
import PasswordField from '../shared/form/PasswordField';

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

  const setSelectedPicId = useFilter((state) => state.setSelectedPicId);

  const onSubmit = (data) => {
    toast.promise(api.post('/auth/login', data), {
      loading: 'Sedang memproses login...',
      success: (res) => {
        login(res.data.user, res.data.access_token, res.data.refresh_token);
        setSelectedPicId(res.data.user.id);
        navigate('/');
        return `Selamat datang, ${res.data.user.name}!`;
      },
      error: (err) => {
        return {
          message: err.response?.data?.message || 'Login gagal.',
          description: err.response?.data?.error_detail || null,
        };
      },
    });
  };

  return (
    <Card>
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
