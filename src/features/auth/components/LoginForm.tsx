import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup } from '@/components/ui/field';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useFilterStore } from '@/stores/filterStore';
import InputField from '@/components/shared/form/InputField';
import PasswordField from '@/components/shared/form/PasswordField';
import { loginSchema, type LoginInput } from '../schemas/authSchemas';
import { useLogin } from '../api/login';

const LoginForm = () => {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutateAsync: loginMutation } = useLogin();

  const setSelectedUserId = useFilterStore((state) => state.setSelectedUserId);

  const onSubmit = (data: LoginInput) => {
    toast.promise(loginMutation(data), {
      loading: 'Sedang memproses log in...',
      success: ({ user }) => {
        setSelectedUserId(user.id);
        return {
          message: 'Log in berhasil',
          // description: `Selamat datang, ${user.profile.name}!`,
        };
      },
      error: (err) => {
        return {
          message: 'Log in gagal',
          description: err.message || null,
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
              label="Password"
            />
            <Field>
              <Button type="submit">Log in</Button>
              {/* <FieldDescription className="text-center">
                Belum memiliki akun? <Link to="/register">Sign up di sini</Link>
              </FieldDescription> */}
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
