// src/hooks/useCustomers.ts

import { useState, useEffect, useMemo } from 'react';
import { customerService } from '@/services/customerService'; // Diarahkan ke file lu
import { getCurrentUser } from '@/actions/auth';

export function useCustomers() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    const [itemsPerPage, setItemsPerPage] = useState<number | 'all'>(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCustomersData();
    }, []);

    const fetchCustomersData = async () => {
        setLoading(true);
        setErrorMsg('');

        try {
        const user = await getCurrentUser() as any;
        if (!user || !user.id) {
            throw new Error('Gagal verifikasi session. Silakan login ulang.');
        }

        // Memanggil fungsi baru di customerService milik lu
        const data = await customerService.getCustomersByUserId(user.id);
        setCustomers(data);
        } catch (err: any) {
        setErrorMsg(err.message || 'Terjadi kesalahan saat mengambil data.');
        } finally {
        setLoading(false);
        }
    };

    const handleDelete = async (customerId: string) => {
        const isConfirm = window.confirm(`Yakin ingin menghapus data pelanggan ${customerId}?`);
        if (!isConfirm) return;

        try {
        // Memanggil fungsi hapus baru di customerService milik lu
        await customerService.deleteCustomer(customerId);
        setCustomers((prev) => prev.filter((cust) => cust.customer_id !== customerId));
        } catch (error: any) {
        alert(`Gagal menghapus data: ${error.message}`);
        }
    };

    const filteredCustomers = useMemo(() => {
        return customers.filter(cust => 
        cust.customer_id?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [customers, searchTerm]);

    const itemsLimit = itemsPerPage === 'all' ? filteredCustomers.length : itemsPerPage;
    const totalPages = Math.ceil(filteredCustomers.length / (itemsLimit || 1));
    const displayedData = filteredCustomers.slice((currentPage - 1) * itemsLimit, currentPage * itemsLimit);

    const handlePageChange = (direction: 'prev' | 'next') => {
        if (direction === 'prev') setCurrentPage(p => Math.max(1, p - 1));
        if (direction === 'next') setCurrentPage(p => Math.min(totalPages, p + 1));
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    const handleItemsPerPage = (val: string) => {
        setItemsPerPage(val === 'all' ? 'all' : Number(val));
        setCurrentPage(1);
    };

    return {
        loading,
        errorMsg,
        searchTerm,
        handleSearch,
        itemsPerPage,
        handleItemsPerPage,
        currentPage,
        handlePageChange,
        filteredCustomers,
        totalPages,
        displayedData,
        handleDelete
    };
}