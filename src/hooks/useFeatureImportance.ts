import { useState, useEffect } from "react";
import { fetchFeatureImportanceStats } from "@/actions/feature-importance";

export function useFeatureImportance() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      setIsLoading(true);
      try {
        const data = await fetchFeatureImportanceStats();
        if (isMounted) {
          if (!data.error) {
            setStats(data);
          } else {
            setError(data.error);
            console.error("Failed to load feature importance stats:", data.error);
          }
        }
      } catch (err) {
        if (isMounted) setError("An unexpected error occurred.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return { stats, isLoading, error };
}