import UpdateAccountForm from '@/components/account/UpdateAccountForm';
import SiteHeader from '@/components/layout/SiteHeader';

const SettingsPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <SiteHeader titlePage="Pengaturan" />
      <div className="flex flex-col gap-2 px-5 pt-4 pb-1">
        <h1 className="text-2xl font-bold tracking-tight">Pengaturan Akun</h1>
        <p className="text-muted-foreground">
          Kelola informasi akun dan pribadi anda.
        </p>
      </div>
      <main className="flex-1 p-4">
        <UpdateAccountForm />
      </main>
    </div>
  );
};

export default SettingsPage;
