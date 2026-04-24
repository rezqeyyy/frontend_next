// src/actions/settings.ts
'use server';

import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function updateSettings(formData: FormData) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_session')?.value;

    console.log("Updating User ID:", userId);

    if (!userId) return { error: 'Sesi habis, silakan login ulang.' };

    const fullName = formData.get('full_name') as string;
    const email = formData.get('email') as string;
    const newPassword = formData.get('new_password') as string;
    const imageFile = formData.get('avatar') as File;

    const updates: any = {};
    if (fullName) updates.full_name = fullName;
    if (email) updates.email = email;

    // 1. Logika Upload Foto
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, imageFile);

      if (uploadError) throw new Error('Gagal upload ke Storage: ' + uploadError.message);

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      updates.avatar_url = publicUrl;
    }

    // 2. Logika Hash Password
    if (newPassword && newPassword.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      updates.password_hash = await bcrypt.hash(newPassword, salt);
    }

    // 3. Update Database
    const { error: dbError } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select();

    if (dbError) throw new Error('Gagal update Database: ' + dbError.message);

    // Revalidate agar Next.js tahu data sudah berubah
    revalidatePath('/', 'layout'); 
    
    // Kembalikan objek yang berisi data terbaru
    return { 
      success: true, 
      newName: fullName, // Ambil dari variabel fullName di atas
      newPhoto: updates.avatar_url // Ambil dari variabel updates jika ada
    };
    
  } catch (err: any) {
    console.error("DEBUG SETTINGS:", err.message);
    return { error: err.message };
  }
}