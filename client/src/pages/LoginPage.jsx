import logo from '@/assets/logo.png';
import { LoginForm } from '@/components/auth/LoginForm';
import { Toaster } from '@/components/ui/sonner';

const LoginPage = () => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center">
          <img src={logo} alt="Logo" className="size-5" />
          <h3 className="tracking-tighter text-xl font-semibold">Kanban App</h3>
        </div>
        <LoginForm />
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
};

export default LoginPage;
