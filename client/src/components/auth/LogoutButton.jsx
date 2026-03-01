import { api } from '@/lib/api';
import useAuthStore from '@/stores/authStore';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const LogoutButton = () => {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.promise(api.post('/logout.php'), {
      loading: 'Sedang memproses logout...',
      success: () => {
        setUser(null);
        navigate('/login');
        return 'Logout berhasil.';
      },
      error: (err) => err.response?.data?.message || 'Logout gagal.',
    });
  };

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      <LogOut />
      Logout
    </Button>
  );
};

export default LogoutButton;
