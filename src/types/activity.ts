import type { Database } from './supabase'; // sesuaikan path

// Ambil type row dari tabel 'activities'
export type Activity = Database['public']['Tables']['activities']['Row'];

// Kalau butuh juga type untuk insert/update
export type ActivityInsert =
  Database['public']['Tables']['activities']['Insert'];
export type ActivityUpdate =
  Database['public']['Tables']['activities']['Update'];
