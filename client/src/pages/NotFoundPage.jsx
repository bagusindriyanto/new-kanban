import { Link } from 'react-router';
import { buttonVariants } from '@/components/ui/button';

const NotFoundPage = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-7xl font-extrabold mb-4">Oops!</h1>
      <h3 className="text-2xl mb-5">Halaman Tidak Ditemukan</h3>
      <Link to="/" className={buttonVariants}>
        Kembali ke halaman utama
      </Link>
    </div>
  );
};

export default NotFoundPage;
