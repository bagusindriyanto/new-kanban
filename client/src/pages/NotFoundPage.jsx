import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <h1 className="text-9xl font-extrabold mb-2">404</h1>
      <h3 className="text-2xl mb-5">Halaman Tidak Ditemukan</h3>
      <Link to="/">
        <Button className="cursor-pointer">Kembali ke halaman utama</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
