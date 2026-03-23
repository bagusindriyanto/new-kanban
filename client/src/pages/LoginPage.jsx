import logo from '@/assets/logo.png';
import LoginForm from '@/components/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="flex flex-col gap-6 justify-center items-center p-6 bg-muted min-h-svh md:p-10">
      <div className="flex flex-col gap-6 w-full max-w-sm">
        <div className="flex gap-2 items-center self-center">
          <img src={logo} alt="Logo" className="size-5" />
          <h3 className="text-xl font-semibold tracking-tighter">Kanban App</h3>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
