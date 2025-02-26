import { useState, useEffect, useMemo } from "react";
import API_BASE_URL from "../../config/api";

export interface Field {
  name: string;
  label: string;
  type: string;
  readOnly?: boolean;
  foreignKey?: boolean;
  optionsEndpoint?: string;
}

export interface ForeignKeyOption {
  value: string;
  label: string;
}

export interface UseForeignKeyOptionsResult {
  foreignKeyOptions: Record<string, ForeignKeyOption[]>;
  isLoading: boolean;
  error: Error | null;
  refetchOptions: () => Promise<void>;
}

function useForeignKeyOptions(fields: Field[]): UseForeignKeyOptionsResult {
  const [foreignKeyOptions, setForeignKeyOptions] = useState<
    Record<string, ForeignKeyOption[]>
  >({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Create an array of unique optionsEndpoints to fetch
  const endpointsToFetch = useMemo(
    () =>
      fields
        .filter((field) => field.foreignKey && field.optionsEndpoint)
        .map((field) => ({
          fieldName: field.name,
          endpoint: field.optionsEndpoint as string,
        })),
    [fields]
  );

  // Fetch each endpoint's data
  const fetchAllOptions = async (): Promise<void> => {
    if (endpointsToFetch.length === 0) return;

    setIsLoading(true);
    setError(null);

    const newOptions: Record<string, ForeignKeyOption[]> = {};

    try {
      const promises = endpointsToFetch.map(async ({ fieldName, endpoint }) => {
        try {
          const response = await fetch(`${API_BASE_URL}${endpoint}`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const result = await response.json();

          newOptions[fieldName] = result.map((item: any) => ({
            value: item.id.toString(),
            label:
              item.name ||
              item[`${endpoint.toLowerCase().slice(0, -1)}_name`] ||
              `Item ${item.id}`,
          }));
        } catch (err) {
          console.error(`Error fetching options for ${fieldName}:`, err);
          newOptions[fieldName] = [];
          throw err;
        }
      });

      await Promise.all(promises);
      setForeignKeyOptions(newOptions);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Error fetching foreign key options")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOptions();
  }, [JSON.stringify(endpointsToFetch)]);

  return {
    foreignKeyOptions,
    isLoading,
    error,
    refetchOptions: fetchAllOptions,
  };
}

export default useForeignKeyOptions;
