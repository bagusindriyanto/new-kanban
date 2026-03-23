import { Link } from 'react-router';
import { buttonVariants } from '@/components/ui/button';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="mb-4 text-7xl font-extrabold">Oops!</h1>
      <h3 className="mb-5 text-2xl">
        Anda tidak diizinkan mengakses halaman ini.
      </h3>
      <Link to="/" className={buttonVariants({ variant: 'default' })}>
        Kembali ke halaman utama
      </Link>
    </div>
  );
};

export default NotFoundPage;
