import type { Database } from './supabase'; // sesuaikan path

// Ambil type row dari tabel 'tasks'
export type Task = Database['public']['Tables']['tasks']['Row'];

// Kalau butuh juga type untuk insert/update
export type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
export type TaskUpdate = Database['public']['Tables']['tasks']['Update'] & {
  id: number;
};
export type TaskStatus = Database['public']['Enums']['task_status'];
