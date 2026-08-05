import type { Database } from './supabase'; // sesuaikan path

// Ambil type row dari tabel 'profiles'
export type Profile = Database['public']['Tables']['profiles']['Row'];

// Kalau butuh juga type untuk insert/update
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
