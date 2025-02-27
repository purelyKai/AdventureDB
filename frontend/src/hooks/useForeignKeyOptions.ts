import { useState, useEffect } from "react";
import { useApi } from "./useApi";

export const useForeignKeyOptions = (
  endpoint: string,
  selectTarget: string
) => {
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    []
  );
  const { fetchData } = useApi(endpoint);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const data = await fetchData();

        if (!data || !Array.isArray(data) || data.length === 0) {
          console.warn(
            `No data received from ${endpoint} for foreign key options`
          );
          return;
        }

        // Get first item to determine id field
        const firstItem = data[0];
        // Find the ID field (ends with _id)
        const idFieldName = Object.keys(firstItem).find(
          (key) =>
            key.endsWith("_id") &&
            key.includes(endpoint.toLowerCase().replace(/_/g, "").slice(0, -1))
        );

        const formattedOptions = data.map((item: any) => {
          // Get correct ID field
          const idField = idFieldName || Object.keys(firstItem)[0]; // Fallback to first column
          // Get label field - make sure item has the target field
          const labelValue =
            item[selectTarget] !== undefined
              ? item[selectTarget]
              : `${endpoint} ${item[idField]}`;

          return {
            value: String(item[idField]),
            label: String(labelValue),
          };
        });

        setOptions(formattedOptions);
        console.log(
          `Loaded ${formattedOptions.length} options for ${endpoint}:`,
          formattedOptions
        );
      } catch (error) {
        console.error(`Error loading options for ${endpoint}:`, error);
        setOptions([]);
      }
    };

    loadOptions();
  }, [fetchData, endpoint, selectTarget]);

  return options;
};
