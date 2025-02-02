import { informationError } from "@/components/informationError";
import { api } from "@/connect/api";
import { useEffect, useState } from "react";

interface SearchOptions {
  school_id: string | number; // Agora é obrigatório
}

export const useSearchPlusSchool = <T>(
  endpoint: string,
  initialQuery: string = "",
  options: SearchOptions
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState(initialQuery);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(
        query
          ? `${endpoint}/${options.school_id}/search/${query}`
          : `${endpoint}/${options.school_id}/search`
      );

      setData(response.data.data);
    } catch (error: any) {
      informationError(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint, query, options.school_id]);

  return { data, loading, error, setQuery, refetch: fetchData };
};
