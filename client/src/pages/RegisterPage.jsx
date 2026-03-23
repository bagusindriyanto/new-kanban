import logo from '@/assets/logo.png';
import RegisterForm from '@/components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="flex flex-col gap-6 justify-center items-center p-6 bg-muted min-h-svh md:p-10">
      <div className="flex flex-col gap-6 w-full max-w-lg">
        <div className="flex gap-2 items-center self-center">
          <img src={logo} alt="Logo" className="size-5" />
          <h3 className="text-xl font-semibold tracking-tighter">Kanban App</h3>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
