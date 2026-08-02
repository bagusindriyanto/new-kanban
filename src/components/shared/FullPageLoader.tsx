import { Spinner } from '@/components/ui/spinner';

const FullPageLoader = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner className="size-10" />
    </div>
  );
};

export default FullPageLoader;
