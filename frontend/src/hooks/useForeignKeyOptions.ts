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
      const data = await fetchData();

      // If data exists and is an array
      if (Array.isArray(data) && data.length > 0) {
        // Determine the correct ID field name based on the endpoint
        // This assumes your ID fields follow the pattern 'table_name_id'
        const idField = `${
          endpoint.toLowerCase().endsWith("s")
            ? endpoint.slice(0, -1)
            : endpoint
        }_id`;

        const formattedOptions = data.map((item: any) => ({
          // Use the appropriate ID field if available, fallback to 'id'
          value: (item[idField] || item.id).toString(),
          label: item[selectTarget]
            ? item[selectTarget].toString()
            : `ID: ${item[idField] || item.id}`,
        }));

        setOptions(formattedOptions);
      }
    };

    loadOptions();
  }, [fetchData, selectTarget, endpoint]);

  return options;
};
