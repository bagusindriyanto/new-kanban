// schemas/authSchemas.ts
import { z } from 'zod';

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const updatePasswordSchema = z
  .object({
    old_password: z
      .string()
      .min(8, 'Password lama tidak boleh kurang dari 8 karakter.'),
    new_password: z
      .string()
      .min(8, 'Password baru tidak boleh kurang dari 8 karakter.'),
    confirm_new_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: 'Password baru tidak sesuai.',
    path: ['confirm_new_password'],
  })
  .refine((data) => data.old_password !== data.new_password, {
    message: 'Password baru tidak boleh sama dengan password lama.',
    path: ['new_password'],
  });

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

export const updateProfileSchema = z.object({
  full_name: z.string().min(1, 'Mohon isi nama lengkap anda.').trim(),
  name: z.string().trim().optional(),
  nik: z
    .string()
    .min(1, 'Mohon isi NIK anda.')
    .refine((val) => /^[0-9]+$/.test(val), {
      error: 'NIK hanya boleh mengandung angka.',
    }),
  avatar: z
    .instanceof(File)
    .nullish()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      'Ukuran file maksimal 1MB',
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Format harus JPG, PNG, atau WebP',
    ),
  delete_avatar: z.boolean().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
