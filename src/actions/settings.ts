// src/actions/settings.ts
'use server';

import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function updateSettings(formData: FormData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_session')?.value;

  if (!userId) return { error: 'Sesi tidak valid, silakan login ulang.' };

  const fullName = formData.get('full_name') as string;
  const newPassword = formData.get('new_password') as string;
  const language = formData.get('language') as string;

  // 1. Set preferensi bahasa ke dalam Cookies
  if (language) {
    cookieStore.set('app_language', language, { path: '/', maxAge: 60 * 60 * 24 * 365 });
  }

  // 2. Siapkan data yang akan diupdate ke Supabase
  const updates: any = {};
  if (fullName) updates.full_name = fullName;

  // 3. Jika input password baru diisi, hash dengan bcrypt
  if (newPassword && newPassword.trim() !== '') {
    const salt = await bcrypt.genSalt(10);
    updates.password_hash = await bcrypt.hash(newPassword, salt);
  }

  // 4. Update data ke tabel 'users'
  if (Object.keys(updates).length > 0) {
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId);

    if (error) return { error: error.message };
  }

  // Refresh data di aplikasi agar nama baru langsung muncul
  revalidatePath('/');
  return { success: true, newName: fullName };
}