// src/services/customerService.ts

import { supabase } from '@/lib/supabase';

export const customerService = {
  /**
   * Mengunggah data pelanggan ke Supabase dengan metode upsert (Fungsi bawaan lu)
   */
  async upsertCustomers(customers: any[]) {
    const { error } = await supabase.from('customers').upsert(customers, {
      onConflict: 'customer_id' 
    });
    
    if (error) throw error;
    return true;
  },

  /**
   * Mengambil data customer berdasarkan user_id (Tambahan untuk list)
   */
  async getCustomersByUserId(userId: string) {
    const { data: userDatasets, error: dsError } = await supabase
      .from('datasets')
      .select('id')
      .eq('user_id', userId);

    if (dsError) throw new Error(dsError.message);

    const datasetIds = userDatasets?.map(d => d.id) || [];
    if (datasetIds.length === 0) return [];

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .in('dataset_id', datasetIds)
      .order('customer_id', { ascending: true })
      .limit(5000);

    if (error) throw new Error(error.message);
    return data || [];
  },

  /**
   * Menghapus 1 data customer (Tambahan untuk delete)
   */
  async deleteCustomer(customerId: string) {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('customer_id', customerId);

    if (error) throw new Error(error.message);
    return true;
  },

  /**
   * Menghapus SEMUA data customer berdasarkan user_id (Tambahan baru untuk delete all)
   */
  async deleteAllCustomers(userId: string) {
    // 1. Cari dulu dataset milik user ini
    const { data: userDatasets, error: dsError } = await supabase
      .from('datasets')
      .select('id')
      .eq('user_id', userId);

    if (dsError) throw new Error(dsError.message);

    const datasetIds = userDatasets?.map(d => d.id) || [];
    
    if (datasetIds.length === 0) {
      throw new Error('Tidak ada data yang ditemukan untuk dihapus.');
    }

    // 2. Hapus semua customer yang ada di dalam dataset tersebut
    const { error } = await supabase
      .from('customers')
      .delete()
      .in('dataset_id', datasetIds);

    if (error) throw new Error(error.message);
    return true;
  }
};