import React, { useState, useEffect } from "react";

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
  endpoint = endpoint + ""; // Temp for build
  const [data, setData] = useState<RecordData[]>([]);
  const [newRecord, setNewRecord] = useState<Record<string, any>>({});
  const [nextId, setNextId] = useState<number>(1);
  const [editRecord, setEditRecord] = useState<RecordData | null>(null);

  useEffect(() => {
    console.log("Data updated:", data);
  }, [data]);

  const handleCreate = () => {
    console.log("Creating record with:", newRecord);
    const record: RecordData = { ...newRecord, id: nextId };
    setData([...data, record]);
    setNextId(nextId + 1);
    setNewRecord({});
  };

  const handleEdit = (record: RecordData) => {
    setEditRecord({ ...record });
  };

  const handleConfirmEdit = () => {
    if (editRecord) {
      const updatedData = data.map((record) =>
        record.id === editRecord.id ? editRecord : record
      );
      setData(updatedData);
      setEditRecord(null);
    }
  };

  const handleCancelEdit = () => {
    setEditRecord(null);
  };

  const handleDelete = (recordId: number) => {
    const updatedData = data.filter((record) => record.id !== recordId);
    setData(updatedData);
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
