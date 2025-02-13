import React, { useState, useEffect } from "react";
import axios from "axios";

interface Field {
  name: string;
  label: string;
  type: string;
  options?: { value: string; label: string }[];
}

interface CRUDTableProps {
  title: string;
  endpoint: string;
  fields: Field[];
}

const CRUDTable: React.FC<CRUDTableProps> = ({ title, endpoint, fields }) => {
  // useState hook for storing the fetched data (existing records)
  const [data, setData] = useState<any[]>([]);
  // useState hook for storing the new record's input values
  const [newRecord, setNewRecord] = useState<Record<string, any>>({});

  // useEffect hook to fetch data when the component mounts or when the endpoint changes
  useEffect(() => {
    fetchData();
  }, [endpoint]);

  // Function to fetch data from the backend
  const fetchData = async () => {
    try {
      const response = await axios.get(endpoint);
      console.log("Fetched data:", response.data);
      const records = Array.isArray(response.data)
        ? response.data
        : response.data.records || [];
      setData(records);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Delete a record by its id
  const handleDelete = async (recordId: any) => {
    try {
      await axios.delete(`${endpoint}/${recordId}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  // Update an existing record
  const handleRowUpdate = async (recordId: any, updatedRecord: any) => {
    try {
      await axios.put(`${endpoint}/${recordId}`, updatedRecord);
      fetchData();
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  // Create a new record and refresh the table
  const handleCreate = async () => {
    console.log("Creating record with:", newRecord);
    try {
      const response = await axios.post(endpoint, newRecord);
      console.log("Record created:", response.data);
      // Append the new record directly to state:
      setData([...data, response.data]);
      // Clear the create row inputs:
      setNewRecord({});
    } catch (error) {
      console.error("Error creating record:", error);
    }
  };
  

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <button
        onClick={fetchData}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Refresh
      </button>
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            {/* Header for the delete column */}
            <th className="border p-2 text-center">
              <span className="text-red-500 font-bold">X</span>
            </th>
            {fields.map((field) => (
              <th key={field.name} className="border p-2">
                {field.label}
              </th>
            ))}
            {/* Header for the update column */}
            <th className="border p-2">Update</th>
          </tr>
        </thead>
        <tbody>
          {/* Render each existing record */}
          {data.map((record) => (
            <tr key={record.id}>
              <td className="border p-2 text-center">
                <button
                  onClick={() => handleDelete(record.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  X
                </button>
              </td>
              {fields.map((field) => (
                <td key={field.name} className="border p-2">
                  <input
                    type={field.type}
                    value={record[field.name] || ""}
                    onChange={(e) => {
                      const updatedValue = e.target.value;
                      // Update local state for immediate feedback
                      const newData = data.map((item) =>
                        item.id === record.id
                          ? { ...item, [field.name]: updatedValue }
                          : item
                      );
                      setData(newData);
                    }}
                    className="w-full p-1 border rounded"
                  />
                </td>
              ))}
              <td className="border p-2 text-center">
                <button
                  onClick={() => handleRowUpdate(record.id, record)}
                  className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  UPDATE
                </button>
              </td>
            </tr>
          ))}
          {/* Create New Record Row */}
          <tr>
            <td className="border p-2"></td>
            {fields.map((field) => (
              <td key={field.name} className="border p-2">
                <input
                  type={field.type}
                  value={newRecord[field.name] || ""}
                  onChange={(e) => {
                    const updated = { ...newRecord, [field.name]: e.target.value };
                    console.log(`Updated ${field.name}:`, updated);
                    setNewRecord(updated);
                  }}
                  className="w-full p-1 border rounded"
                  placeholder={field.label}
                />
              </td>
            ))}
            <td className="border p-2 text-center">
              <button
                onClick={handleCreate}
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Create
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CRUDTable;
