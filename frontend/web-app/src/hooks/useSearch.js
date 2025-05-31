import { useState } from 'react';
import { searchApi } from '@/services';

export const useSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (searchParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await searchApi.search(searchParams);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to search';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const reindexData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await searchApi.reindexData();
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to reindex data';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    search,
    reindexData,
  };
};
