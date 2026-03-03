import { Spinner } from '@/components/ui/spinner';

const LoadingPage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner className="size-10" />
    </div>
  );
};

export default LoadingPage;
