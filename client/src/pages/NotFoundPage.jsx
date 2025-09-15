import { Link } from 'react-router';

const NotFoundPage = () => {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <h1 className="text-9xl font-extrabold mb-2">404</h1>
      <h3 className="text-2xl mb-5">Halaman Tidak Ditemukan</h3>
      <Link to="/" className="underline">
        Kembali ke halaman utama
      </Link>
    </div>
  );
};

export default NotFoundPage;
