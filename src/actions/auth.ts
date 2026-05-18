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
  // 1. Tangkap semua data dari form
  const fullName = formData.get('full_name') as string;
  const email = formData.get('email') as string;
  const employeeId = formData.get('employee_id') as string;
  const department = formData.get('department') as string;
  const password = formData.get('password') as string;

  // 2. Validasi field baru
  if (!fullName || !email || !employeeId || !department || !password) {
    return { error: 'Semua field wajib diisi' };
  }

  const supabase = await getSupabaseClient();

  // 3. AUTH RESMI: Masukin semua data tambahan ke user_metadata
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        employee_id: employeeId,
        department: department,
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

  // 4. Mapping data dari metadata biar frontend (Sidebar/Profile) tinggal pake semua isinya
  return {
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || 'User',
    employee_id: user.user_metadata?.employee_id || null,
    department: user.user_metadata?.department || null,
    avatar_url: user.user_metadata?.avatar_url || null,
  };
}

// --- FUNGSI SIGN OUT ---
export async function signOut() {
  const supabase = await getSupabaseClient();
  
  // Hapus session di server Supabase & hapus cookies otomatis
  await supabase.auth.signOut();
  
  redirect('/');
}