import { useState, useEffect, useCallback, useMemo } from 'react';
import { getQueue } from '@/services/queue';

export function useQueue(API_BASE_URL, token) {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);

  const fetchQueueData = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getQueue(API_BASE_URL, token);
      if (data.success) setTokens(data.tokens);
      setError('');
    } catch (err) {
      console.error('Queue poll fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, token]);

  useEffect(() => {
    if (!token) return;
    fetchQueueData();
    const intervalId = setInterval(() => {
      fetchQueueData();
      setRefreshCount((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [token, fetchQueueData]);

  const groupedTokens = useMemo(() => {
    return tokens.reduce((groups, token) => {
      const docId = token.doctorId;
      if (!groups[docId]) {
        groups[docId] = {
          doctorName: token.doctor.name,
          specialization: token.doctor.specialization,
          calling: null,
          waiting: [],
        };
      }

      if (token.status === 'CALLING') {
        groups[docId].calling = token;
      } else if (token.status === 'WAITING') {
        groups[docId].waiting.push(token);
      }
      return groups;
    }, {});
  }, [tokens]);

  return { tokens, loading, error, refreshCount, groupedTokens, fetchQueueData };
}
