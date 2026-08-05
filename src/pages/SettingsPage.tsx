import UpdateUserTabs from '@/features/auth/components/UpdateUserTabs';

const SettingsPage = () => {
  return (
    <section className="flex flex-col">
      <div className="flex flex-col px-4 pt-4">
        <div className="ml-1">
          <h1 className="text-2xl font-bold tracking-tight">Pengaturan Akun</h1>
          <p className="text-muted-foreground">
            Kelola informasi akun dan pribadi anda.
          </p>
        </div>
      </div>
      <main className="flex-1 p-4">
        <UpdateUserTabs />
      </main>
    </section>
  );
};

export default SettingsPage;
