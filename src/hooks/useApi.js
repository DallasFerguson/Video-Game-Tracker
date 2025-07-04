import { useState, useCallback } from 'react';

const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction(...args);
      setData(response);
      return response;
    } catch (err) {
      setError(err.message || 'Something went wrong');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  return { data, loading, error, execute };
};

export default useApi;