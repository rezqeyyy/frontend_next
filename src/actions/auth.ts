// src/actions/auth.ts
'use server';

import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

// --- FUNGSI LOGIN ---
export async function loginUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) return { error: 'Email dan password wajib diisi' };

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) return { error: 'Akun tidak ditemukan' };

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) return { error: 'Password salah' };

  const cookieStore = await cookies();
  cookieStore.set('user_session', user.id, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 
  });

  return { success: true };
}

// --- FUNGSI REGISTER ---
export async function registerUser(formData: FormData) {
  const fullName = formData.get('full_name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!fullName || !email || !password) return { error: 'Semua field wajib diisi' };

  // 1. Hash password sebelum disimpan
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 2. Simpan ke tabel 'users' di Supabase
  const { data: newUser, error } = await supabase
    .from('users')
    .insert([
      { 
        full_name: fullName, 
        email: email, 
        password_hash: hashedPassword 
      }
    ])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') return { error: 'Email sudah terdaftar' };
    return { error: error.message };
  }

  // 3. Langsung buat sesi login setelah register sukses
  const cookieStore = await cookies();
  cookieStore.set('user_session', newUser.id, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 
  });

  return { success: true };
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_session')?.value;

  if (!userId) return null;

  // Ambil data user dari Supabase berdasarkan ID di session
  const { data: user } = await supabase
    .from('users')
    .select('full_name')
    .eq('id', userId)
    .single();

  return user;
}