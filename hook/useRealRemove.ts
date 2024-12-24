import { api } from "../connect/api";
import { useState } from "react";
import { informationError } from "../components/informationError";

export const useRemoveReal = (endpoint: string, refetchFn?: () => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  const removeData = async (id: string | number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`${endpoint}/${id}`);
      setData(response.data);

      // Chama a função de refetch se fornecida
      if (refetchFn) {
        refetchFn();
      }

      return response.data;
    } catch (error) {
      setError(error);
      informationError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, realRemoveData };
};
