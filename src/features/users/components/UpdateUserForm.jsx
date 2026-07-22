import { Card, CardContent } from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuthStore from '@/stores/authStore';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { refreshData } from '@/utils/refreshData';
import InputField from '@/components/shared/form/InputField';
import PasswordField from '@/components/shared/form/PasswordField';
import AvatarUpload from '@/components/shared/form/AvatarUpload';
import { getAvatarURL } from '../utils/getAvatarURL';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UpdateProfileForm from './UpdateProfileForm';

const UpdateUserForm = () => {
  return (
    <Tabs defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile">Profil</TabsTrigger>
        <TabsTrigger value="account">Keamanan</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <UpdateProfileForm />
      </TabsContent>
      <TabsContent value="account">Change your password here.</TabsContent>
    </Tabs>
  );
};

export default UpdateUserForm;
