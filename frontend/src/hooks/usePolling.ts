import { useState, useEffect, useRef } from 'react';

export function usePolling<T>(
  fetcher: () => Promise<T>,
  interval: number = 3000,
  initialData?: T
) {
  const [data, setData] = useState<T | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const poll = async () => {
    try {
      setLoading(true);
      const result = await fetcher();
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
      console.error('Polling error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    poll(); // initial fetch

    intervalRef.current = setInterval(poll, interval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetcher, interval]);

  return { data, loading, error, refetch: poll };
}