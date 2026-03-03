import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
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
import useAuthStore from '@/stores/authStore';
import { Link, useNavigate } from 'react-router';
import { api } from '@/lib/api';

const formSchema = z.object({
  username: z.string().min(1, 'Mohon isi username anda.'),
  password: z.string().min(1, 'Mohon isi kata sandi anda.'),
});

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    toast.promise(api.post('/login.php', data), {
      loading: 'Sedang memproses login...',
      success: (res) => {
        setUser(res.data.user);
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
        <CardTitle className="text-xl">Selamat Datang!</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-username">Username</FieldLabel>
                  <Input {...field} id="login-username" type="text" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-password">Kata Sandi</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      id="login-password"
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
