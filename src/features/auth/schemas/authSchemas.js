// schemas/authSchemas.ts
import { z } from 'zod';

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const registerSchema = z
  .object({
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
      .optional()
      .refine(
        (file) => !file || file.size <= MAX_FILE_SIZE,
        'Ukuran file maksimal 1MB',
      )
      .refine(
        (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
        'Format harus JPG, PNG, atau WebP',
      ),
    division_id: z.number('Mohon pilih divisi anda.'),
    role_id: z.number('Mohon pilih jabatan anda.'),
    email: z
      .email('Mohon isi email dengan benar.')
      .min(1, 'Mohon isi email anda.'),
    password: z.string().min(8, 'Password tidak boleh kurang dari 8 karakter.'),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Password tidak sesuai.',
    path: ['confirm_password'],
  });
