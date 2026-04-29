import logo from '@/assets/logo.png';
import AnimatedBackground from '@/components/background/AnimatedBackground';
import { Outlet } from 'react-router';

const EntryLayout = () => {
  return (
    <AnimatedBackground>
      <div className="flex justify-center items-center p-6 min-h-svh md:p-10">
        <div className="flex flex-col gap-6 w-full">
          <div className="flex gap-2 items-center self-center">
            <img src={logo} alt="Logo" className="size-5" />
            <h3 className="text-xl font-semibold tracking-tighter">
              Kanban App
            </h3>
          </div>
          <Outlet />
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default EntryLayout;
