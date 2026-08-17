import UpdateUserTabs from '@/features/auth/components/UpdateUserTabs';

const SettingsPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Pengaturan Akun</h2>
        <p className="text-muted-foreground">
          Kelola informasi akun dan pribadi anda.
        </p>
      </div>
      <UpdateUserTabs />
    </div>
  );
};

export default SettingsPage;
