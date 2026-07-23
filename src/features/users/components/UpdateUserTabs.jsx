import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UpdateProfileForm from './UpdateProfileForm';
import UpdatePasswordForm from './UpdatePasswordForm';

const UpdateUserTabs = () => {
  return (
    <Tabs defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile">Profil</TabsTrigger>
        <TabsTrigger value="account">Keamanan</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <UpdateProfileForm />
      </TabsContent>
      <TabsContent value="account">
        <UpdatePasswordForm />
      </TabsContent>
    </Tabs>
  );
};

export default UpdateUserTabs;
