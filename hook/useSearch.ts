import { api } from "../connect/api";
import { useEffect, useState } from "react";
import { informationError } from "../components/informationError";

interface ApiResponse<T> {
  data: T[];
}

export const useSearch = <T>(endpoint: string, initialQuery: string = "") => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState(initialQuery);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(
        query ? `${endpoint}/search/${query}` : `${endpoint}/search`
      );

      // setData(response.data || response.data.data);
      setData(response.data.data);
    } catch (error) {
      informationError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint, query]);

  return { data, loading, error, setQuery, refetch: fetchData };
};
