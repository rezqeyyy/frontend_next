// src/actions/auth.ts
'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Helper untuk inisialisasi Supabase Server Client di setiap action
async function getSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            // HAPUS UMUR COOKIE DI SINI
            const sessionOptions = { ...options };
            delete sessionOptions.maxAge;
            delete sessionOptions.expires;

            cookieStore.set({ name, value, ...sessionOptions });
          } catch (error) {
            // Handle middleware set cookies
          }
        },
        remove(name: string, options: any) {
          try {
            // HAPUS UMUR COOKIE DI SINI JUGA
            const sessionOptions = { ...options };
            delete sessionOptions.maxAge;
            delete sessionOptions.expires;

            cookieStore.set({ name, value: '', ...sessionOptions });
          } catch (error) {
            // Handle middleware remove cookies
          }
        },
      },
    }
  );
}

// --- FUNGSI LOGIN ---
export async function loginUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) return { error: 'Email dan password wajib diisi' };

  const supabase = await getSupabaseClient();

  // AUTH RESMI: Supabase bakal nge-hash & ngecek password otomatis
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { error: error.message };

  return { success: true };
}

// --- FUNGSI REGISTER ---
export async function registerUser(formData: FormData) {
  const fullName = formData.get('full_name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!fullName || !email || !password) return { error: 'Semua field wajib diisi' };

  const supabase = await getSupabaseClient();

  // AUTH RESMI: Masukin nama ke user_metadata biar kesimpen permanen
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      }
    }
  });

  if (error) return { error: error.message };

  return { success: true };
}

// --- FUNGSI GET CURRENT USER (LAPIS BAJA) ---
export async function getCurrentUser() {
  const supabase = await getSupabaseClient();

  // PENTING: getUser() melakukan validasi token secara real-time ke server
  // Ini yang bikin dashboard lu gak bisa ditembus cuma modal ganti parameter URL
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) return null;

  // Mapping data dari metadata biar frontend (Sidebar/Settings) tinggal pake
  return {
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || 'User',
    avatar_url: user.user_metadata?.avatar_url || null,
  };
}

// --- FUNGSI SIGN OUT ---
export async function signOut() {
  const supabase = await getSupabaseClient();
  
  // Hapus session di server Supabase & hapus cookies otomatis
  await supabase.auth.signOut();
  
  redirect('/login');
}