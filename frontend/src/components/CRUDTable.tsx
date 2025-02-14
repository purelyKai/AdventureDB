import React, { useState, useEffect } from "react";

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

interface RecordData {
  id: number;
  [key: string]: any;
}

const CRUDTable: React.FC<CRUDTableProps> = ({ title, endpoint, fields }) => {
  endpoint = endpoint + ""; // Temp for build
  // State to hold the list of records (mock data)
  const [data, setData] = useState<RecordData[]>([]);
  // State to hold the new record's inputs
  const [newRecord, setNewRecord] = useState<Record<string, any>>({});
  // A counter to generate unique ids for new records
  const [nextId, setNextId] = useState<number>(1);

  // useEffect to log when data changes (you can add any side effect here)
  useEffect(() => {
    console.log("Data updated:", data);
  }, [data]);

  // Create a new record and update the table
  const handleCreate = () => {
    console.log("Creating record with:", newRecord);
    // Generate a new record with a unique id
    const record: RecordData = { ...newRecord, id: nextId };
    // Append the new record to the existing data
    setData([...data, record]);
    // Increment the id counter
    setNextId(nextId + 1);
    // Clear the input fields for the next new record
    setNewRecord({});
  };

  // Update an existing record when an input changes
  const handleRowUpdate = (recordId: number, fieldName: string, value: any) => {
    const updatedData = data.map((record) =>
      record.id === recordId ? { ...record, [fieldName]: value } : record
    );
    setData(updatedData);
  };

  // Delete a record from the data
  const handleDelete = (recordId: number) => {
    const updatedData = data.filter((record) => record.id !== recordId);
    setData(updatedData);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            {/* Column header for deletion */}
            <th className="border p-2 text-center">
              <span className="text-red-500 font-bold">X</span>
            </th>
            {fields.map((field) => (
              <th key={field.name} className="border p-2">
                {field.label}
              </th>
            ))}
            {/* Column header for update (for visual purposes) */}
            <th className="border p-2">Update</th>
          </tr>
        </thead>
        <tbody>
          {/* Existing records */}
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
                    onChange={(e) =>
                      handleRowUpdate(record.id, field.name, e.target.value)
                    }
                    className="w-full p-1 border rounded"
                  />
                </td>
              ))}
              <td className="border p-2 text-center">
                {/* The update button is optional since changes are immediate */}
                <button className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                  Update
                </button>
              </td>
            </tr>
          ))}
          {/* Create new record row */}
          <tr>
            <td className="border p-2"></td>
            {fields.map((field) => (
              <td key={field.name} className="border p-2">
                <input
                  type={field.type}
                  value={newRecord[field.name] || ""}
                  onChange={(e) =>
                    setNewRecord({
                      ...newRecord,
                      [field.name]: e.target.value,
                    })
                  }
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
