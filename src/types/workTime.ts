import type { Database } from './supabase'; // sesuaikan path

// Ambil type row dari tabel 'work_times'
export type WorkTime = Database['public']['Tables']['work_times']['Row'];

// Kalau butuh juga type untuk insert/update
export type WorkTimeInsert =
  Database['public']['Tables']['work_times']['Insert'];
export type WorkTimeUpdate =
  Database['public']['Tables']['work_times']['Update'];
