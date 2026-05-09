// src/actions/settings.ts
'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function updateSettings(formData: FormData) {
  try {
    const cookieStore = await cookies();
    
    // 1. Inisialisasi Supabase Server Client (buat akses session resmi)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // 2. Validasi User secara Real-time (Bukan manual dari cookie user_session)
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Sesi habis, silakan login ulang.' };
    }

    const fullName = formData.get('full_name') as string;
    const email = formData.get('email') as string;
    const newPassword = formData.get('new_password') as string;
    const imageFile = formData.get('avatar') as File;

    // Persiapkan data untuk update di Auth Supabase
    const updateData: any = {
      data: {} // Folder metadata
    };

    if (email) updateData.email = email;
    if (newPassword && newPassword.trim() !== '') updateData.password = newPassword;
    if (fullName) updateData.data.full_name = fullName;

    // 3. Logika Upload Foto ke Storage
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, imageFile);

      if (uploadError) throw new Error('Gagal upload ke Storage: ' + uploadError.message);

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Simpan URL foto ke metadata user
      updateData.data.avatar_url = publicUrl;
    }

    // 4. Update Supabase Auth (Menggantikan update manual ke tabel public.users)
    const { error: updateError } = await supabase.auth.updateUser(updateData);

    if (updateError) throw new Error('Gagal update Auth: ' + updateError.message);

    // Revalidate agar UI Sidebar & Dashboard langsung update
    revalidatePath('/', 'layout'); 
    
    return { 
      success: true, 
      newName: fullName,
      newPhoto: updateData.data.avatar_url
    };
    
  } catch (err: any) {
    console.error("DEBUG SETTINGS:", err.message);
    return { error: err.message };
  }
}