import PasswordField from '@/components/shared/form/PasswordField';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { useUpdatePassword } from '@/features/auth/api/updatePassword';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  updatePasswordSchema,
  type UpdatePasswordInput,
} from '../schemas/updateUserSchemas';

const UpdatePasswordForm = () => {
  const form = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_new_password: '',
    },
  });

  const { mutateAsync: updatePasswordMutate, isPending } = useUpdatePassword();

  const onSubmit = (data: UpdatePasswordInput) => {
    toast.promise(updatePasswordMutate(data), {
      loading: 'Sedang memperbarui akun...',
      success: () => {
        form.reset();
        return 'Password Anda berhasil diperbarui';
      },
      error: (err: Error) => {
        return {
          message: 'Password Anda gagal diperbarui',
          description: err?.message || null,
        };
      },
    });
  };

  return (
    <Card>
      <CardContent>
        <form
          id="update-password-account"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            {/* Old Password */}
            <PasswordField
              name="old_password"
              control={form.control}
              label="Password Lama"
              required
              placeholder="Masukkan password lama anda"
            />
            {/* New Password */}
            <PasswordField
              name="new_password"
              control={form.control}
              label="Password Baru"
              required
              placeholder="Masukkan password baru anda"
              description="Password minimal memiliki 8 karakter."
            />
            {/* Confirm Password */}
            <PasswordField
              name="confirm_new_password"
              control={form.control}
              label="Konfirmasi Password Baru"
              required
              placeholder="Masukkan kembali password baru anda"
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="justify-end">
        <Button
          type="submit"
          form="update-password-account"
          disabled={isPending}
        >
          {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UpdatePasswordForm;
