import logo from '@/assets/logo.png';
import RegisterForm from '@/components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-lg flex-col gap-6">
        <div className="flex items-center gap-2 self-center">
          <img src={logo} alt="Logo" className="size-5" />
          <h3 className="tracking-tighter text-xl font-semibold">Kanban App</h3>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
