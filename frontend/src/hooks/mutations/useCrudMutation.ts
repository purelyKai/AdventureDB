import { useState, useCallback } from "react";
import API_BASE_URL from "../../config/api";

export interface MutationOptions {
  endpoint: string;
  method: "POST" | "PUT" | "DELETE";
  onSuccess?: () => void;
}

export interface UseCrudMutationResult<T> {
  mutate: (data?: T, id?: number) => Promise<boolean>;
  isLoading: boolean;
  error: Error | null;
  reset: () => void;
}

function useCrudMutation<T = any>(
  options: MutationOptions
): UseCrudMutationResult<T> {
  const { endpoint, method, onSuccess } = options;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const reset = useCallback((): void => {
    setError(null);
  }, []);

  const mutate = useCallback(
    async (data?: T, id?: number): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const url = id
          ? `${API_BASE_URL}${endpoint}/${id}`
          : `${API_BASE_URL}${endpoint}`;

        const response = await fetch(url, {
          method,
          headers:
            method !== "DELETE"
              ? { "Content-Type": "application/json" }
              : undefined,
          body: method !== "DELETE" ? JSON.stringify(data) : undefined,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! Status: ${response.status}, Message: ${errorText}`
          );
        }

        if (onSuccess) {
          onSuccess();
        }

        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Unknown error occurred")
        );
        console.error(`Error in ${method} operation:`, err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [endpoint, method, onSuccess]
  );

  return {
    mutate,
    isLoading,
    error,
    reset,
  };
}

export default useCrudMutation;
