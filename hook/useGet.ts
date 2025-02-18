import { informationError } from "@/components/informationError";
import { useState } from "react";
import { api } from "../connect/api";

// interface ApiResponse<T> {
//   data: {
//     data: T[];
//   };
// }

export const useGet = <T>(endpoint: string) => {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (id?: string | number) => {
    setLoading(true);
    setError(null);

    try {
      const url = id ? `${endpoint}/${id}` : endpoint;
      const response = await api.get(url);
      setData(response.data.data);
    } catch (error: any) {
      setError(error);
      informationError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData };
};
