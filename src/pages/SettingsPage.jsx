import UpdateUserForm from '@/features/users/components/UpdateUserForm';

const SettingsPage = () => {
  return (
    <section className="flex flex-col">
      <div className="flex flex-col gap-2 px-5 pt-4 pb-1">
        <h1 className="text-2xl font-bold tracking-tight">Pengaturan Akun</h1>
        <p className="text-muted-foreground">
          Kelola informasi akun dan pribadi anda.
        </p>
      </div>
      <main className="flex-1 px-6 py-4">
        <UpdateUserForm />
      </main>
    </section>
  );
};

export default SettingsPage;
