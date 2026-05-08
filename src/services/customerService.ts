import { supabase } from '@/lib/supabase';

export const customerService = {
  /**
   * Mengunggah data pelanggan ke Supabase dengan metode upsert
   */
  async upsertCustomers(customers: any[]) {
    const { error } = await supabase.from('customers').upsert(customers, {
      onConflict: 'customer_id' 
    });
    
    if (error) throw error;
    return true;
  }
};