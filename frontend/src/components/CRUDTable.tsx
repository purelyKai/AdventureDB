import React, { useState, useEffect } from "react";

const API_BASE_URL = "https://adventuredb-backend.onrender.com/api/";

interface Field {
  name: string;
  label: string;
  type: string;
  options?: { value: string; label: string }[];
  readOnly?: boolean;
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
  const [data, setData] = useState<RecordData[]>([]);
  const [newRecord, setNewRecord] = useState<Record<string, any>>({});
  const [editRecord, setEditRecord] = useState<RecordData | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecord),
      });
      if (response.ok) {
        fetchData();
        setNewRecord({});
      }
    } catch (error) {
      console.error("Error creating record:", error);
    }
  };

  const handleEdit = (record: RecordData) => {
    setEditRecord({ ...record });
  };

  const handleConfirmEdit = async () => {
    if (editRecord) {
      try {
        const response = await fetch(
          `${API_BASE_URL}${endpoint}/${editRecord.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editRecord),
          }
        );
        if (response.ok) {
          fetchData();
          setEditRecord(null);
        }
      } catch (error) {
        console.error("Error updating record:", error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditRecord(null);
  };

  const handleDelete = async (recordId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}/${recordId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  return (
    <div className="p-4 flex gap-8">
      <div className="w-1/3 p-4 border rounded shadow-lg">
        <h2 className="text-lg font-bold mb-2">Add New Record</h2>
        {fields.map((field) => (
          <div key={field.name} className="mb-2">
            <label className="block text-sm font-medium mb-1">
              {field.label}
            </label>
            <input
              type={field.type}
              value={newRecord[field.name] || ""}
              onChange={(e) =>
                setNewRecord({ ...newRecord, [field.name]: e.target.value })
              }
              className="w-full p-2 border rounded"
              placeholder={field.label}
              readOnly={field.readOnly}
            />
          </div>
        ))}
        <button
          onClick={handleCreate}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create
        </button>
      </div>
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 text-center">
                <span className="text-red-500 font-bold">X</span>
              </th>
              {fields.map((field) => (
                <th key={field.name} className="border p-2">
                  {field.label}
                </th>
              ))}
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
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
                    {editRecord && editRecord.id === record.id ? (
                      <input
                        type={field.type}
                        value={editRecord[field.name] || ""}
                        onChange={(e) =>
                          setEditRecord({
                            ...editRecord,
                            [field.name]: e.target.value,
                          })
                        }
                        className="w-full p-1 border rounded"
                        readOnly={field.readOnly}
                      />
                    ) : (
                      <span>{record[field.name]}</span>
                    )}
                  </td>
                ))}
                <td className="border p-2">
                  {editRecord && editRecord.id === record.id ? (
                    <>
                      <button
                        onClick={handleConfirmEdit}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEdit(record)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CRUDTable;
