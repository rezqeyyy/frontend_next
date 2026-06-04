// src/hooks/usePredictionResults.ts

import { useState, useEffect, useRef, useMemo } from 'react';
import { getCurrentUser } from '@/actions/auth';
import { predictionService, CustomerData } from '@/services/predictionService';

export function usePredictionResults() {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [itemsPerPage, setItemsPerPage] = useState<number | 'all'>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State baru untuk filter Rank Level
  const [selectedRank, setSelectedRank] = useState<string>('all');

  const [isPredicting, setIsPredicting] = useState(false);
  const [predictProgress, setPredictProgress] = useState(0);
  const [predictError, setPredictError] = useState(false);
  
  const isPredictingRef = useRef(false);

  useEffect(() => {
    fetchResults();
    autoPredictAllDatabase();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (!isPredictingRef.current && !predictError) {
          autoPredictAllDatabase();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [predictError]);

  const fetchResults = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const user = await getCurrentUser() as any;
      if (!user || !user.id) {
        setErrorMessage('Session verification failed. Please log in again.');
        setIsLoading(false);
        return;
      }

      const datasetIds = await predictionService.getUserDatasetIds(user.id);
      if (datasetIds.length === 0) {
        setCustomers([]);
        setIsLoading(false);
        return;
      }

      const data = await predictionService.getPredictionResults(datasetIds);
      setCustomers(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to fetch prediction data.');
    } finally {
      setIsLoading(false);
    }
  };

  const runPredictionSilent = async (customerData: CustomerData) => {
    try {
      const result = await predictionService.executeSinglePrediction(customerData);

      setCustomers((prevData) => {
        const updatedData = prevData.map((c) => 
          c.id === customerData.id 
            ? { ...c, churn_risk_score: result.score, rank_level: result.rank, revenue_at_risk: result.revenue }
            : c
        );
        return updatedData.sort((a, b) => (b.churn_risk_score || 0) - (a.churn_risk_score || 0));
      });

      return true;
    } catch (error) {
      console.error(`Auto-prediction failed for ID ${customerData.id}:`, error);
      return false; 
    }
  };

  const autoPredictAllDatabase = async () => {
    if (isPredictingRef.current) return; 

    try {
      setPredictError(false);

      const user = await getCurrentUser() as any;
      if (!user || !user.id) return;

      const datasetIds = await predictionService.getUserDatasetIds(user.id);
      if (datasetIds.length === 0) return;
      
      const { totalCount, unpredictedCustomers } = await predictionService.getUnpredictedCustomers(datasetIds);
      
      if (!unpredictedCustomers || unpredictedCustomers.length === 0) return;

      isPredictingRef.current = true;
      setIsPredicting(true);

      let completed = totalCount - unpredictedCustomers.length; 
      setPredictProgress(Math.round((completed / totalCount) * 100));

      for (let i = 0; i < unpredictedCustomers.length; i++) {
        if (!isPredictingRef.current) break;

        const success = await runPredictionSilent(unpredictedCustomers[i]);
        
        if (!success) {
          throw new Error(`Failed to predict record with ID: ${unpredictedCustomers[i].id}`);
        }
        
        completed++;
        setPredictProgress(Math.round((completed / totalCount) * 100));
      }

      if (isPredictingRef.current) {
        setTimeout(() => {
          setIsPredicting(false);
          isPredictingRef.current = false;
          fetchResults();
        }, 1000);
      }
    } catch (err) {
      console.error("Error during batch prediction:", err);
      setPredictError(true); 
      isPredictingRef.current = false;
    }
  };

  // LOGIKA FILTER COMBINED: Menyaring berdasarkan Search Term DAN Rank Level sekaligus
  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      const matchesSearch = cust.customer_id?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRank = selectedRank === 'all' || cust.rank_level === selectedRank;
      return matchesSearch && matchesRank;
    });
  }, [customers, searchTerm, selectedRank]);

  const itemsLimit = itemsPerPage === 'all' ? filteredCustomers.length : itemsPerPage;
  const totalPages = Math.ceil(filteredCustomers.length / (itemsLimit || 1));
  const displayedData = filteredCustomers.slice((currentPage - 1) * itemsLimit, currentPage * itemsLimit);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (val: string) => {
    setItemsPerPage(val === 'all' ? 'all' : Number(val));
    setCurrentPage(1);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Fungsi handler baru untuk mengubah filter Rank
  const handleRankFilterChange = (rank: string) => {
    setSelectedRank(rank);
    setCurrentPage(1); // Reset ke halaman 1 saat filter diubah
  };

  return {
    customers,
    filteredCustomers,
    searchTerm,
    selectedRank,
    isLoading,
    errorMessage,
    itemsPerPage,
    currentPage,
    isPredicting,
    predictProgress,
    predictError,
    totalPages,
    displayedData,
    handlePageChange,
    handleItemsPerPageChange,
    handleSearchChange,
    handleRankFilterChange
  };
}