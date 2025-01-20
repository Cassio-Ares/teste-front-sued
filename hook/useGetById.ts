import { useState } from "react";
import { api } from "../connect/api";

// interface ApiResponse<T> {
//   data: {
//     data: T[];
//   };
// }

export const useGetById = <T>(endpoint: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (id: string | number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<{ data: T[] }>(`${endpoint}/${id}`);
      setData(response.data.data);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData };
};
