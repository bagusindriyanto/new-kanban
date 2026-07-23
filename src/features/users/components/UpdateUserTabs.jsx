import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UpdateProfileForm from './UpdateProfileForm';
import UpdatePasswordForm from './UpdatePasswordForm';
import { UserIcon, LockIcon } from 'lucide-react';

const UpdateUserTabs = () => {
  return (
    <Tabs defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile">
          <UserIcon />
          Profil
        </TabsTrigger>
        <TabsTrigger value="account">
          <LockIcon />
          Keamanan
        </TabsTrigger>
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
