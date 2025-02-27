import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useApi } from "../hooks/useApi";
import { useForeignKeyOptions } from "../hooks/useForeignKeyOptions";
import type { Field } from "../lib/types";

interface CRUDTableProps {
  title: string;
  endpoint: string;
  fields: Field[];
}

const CRUDTable: React.FC<CRUDTableProps> = ({ title, endpoint, fields }) => {
  const [data, setData] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newItem, setNewItem] = useState<any>({});
  const { fetchData, createItem, updateItem, deleteItem, isLoading, error } =
    useApi(endpoint);

  // Get the primary key field (assuming it's the first field)
  const primaryKeyField = fields[0];

  // Call useForeignKeyOptions for all fields that are foreign keys
  const foreignKeyOptions = fields
    .filter((field) => field.foreignKey)
    .map((field) => ({
      fieldName: field.name,
      options:
        field.optionsEndpoint && field.selectTarget
          ? useForeignKeyOptions(field.optionsEndpoint, field.selectTarget)
          : [],
    }));

  const loadData = useCallback(async () => {
    const result = await fetchData();
    setData(result);
  }, [fetchData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    foreignKeyOptions.forEach((option) => {
      console.log(`Options for ${option.fieldName}:`, option.options);
    });
  }, [foreignKeyOptions]);

  useEffect(() => {
    console.log("Table data loaded:", data);
  }, [data]);

  const handleEdit = (id: number) => {
    setEditingId(id);
  };

  const handleSave = async (id: number, item: any) => {
    if (id === -1) {
      // Creating a new item
      await createItem(item);
    } else {
      // Editing an existing item
      await updateItem(id, item);
    }
    setEditingId(null);
    setNewItem({});
    loadData();
  };

  const handleDelete = async (id: number) => {
    await deleteItem(id);
    loadData();
  };

  const handleNewItemChange = (field: string, value: any) => {
    setNewItem({ ...newItem, [field]: value });
  };

  const handleEditItemChange = (id: number, field: string, value: any) => {
    const updatedData = data.map((item) =>
      item[primaryKeyField.name] === id ? { ...item, [field]: value } : item
    );
    setData(updatedData);
  };

  const renderInputField = (
    field: Field,
    value: any,
    onChange: (value: any) => void,
    isReadOnly: boolean = false
  ) => {
    if (field.foreignKey && field.optionsEndpoint) {
      const options =
        foreignKeyOptions.find((option) => option.fieldName === field.name)
          ?.options || [];

      // Convert value to string to match option format
      const stringValue =
        value !== null && value !== undefined ? String(value) : "";

      return (
        <select
          value={stringValue}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border rounded"
          disabled={isReadOnly}
        >
          <option value="">Select {field.label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    } else {
      return (
        <input
          type={field.type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border rounded"
          readOnly={isReadOnly}
        />
      );
    }
  };

  // Function to display foreign key values properly
  const displayFieldValue = (item: any, field: Field) => {
    if (field.foreignKey && field.optionsEndpoint) {
      const options =
        foreignKeyOptions.find((option) => option.fieldName === field.name)
          ?.options || [];

      const option = options.find(
        (opt) => opt.value === item[field.name]?.toString()
      );

      return option ? option.label : item[field.name];
    }

    return item[field.name];
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 flex">
      {/* Add Form */}
      <div className="w-1/3 pr-4">
        <h3 className="text-xl font-bold mb-4">Add New {title}</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave(-1, newItem);
          }}
        >
          {fields
            .filter((field) => !field.readOnly)
            .map((field) => (
              <div key={field.name} className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                {renderInputField(field, newItem[field.name], (value) =>
                  handleNewItemChange(field.name, value)
                )}
              </div>
            ))}
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="w-2/3">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {fields.map((field) => (
                <th key={field.name} className="px-4 py-2 text-left">
                  {field.label}
                </th>
              ))}
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item[primaryKeyField.name]}
                className="border-t border-gray-300"
              >
                {fields.map((field) => (
                  <td key={field.name} className="px-4 py-2">
                    {editingId === item[primaryKeyField.name]
                      ? renderInputField(
                          field,
                          item[field.name],
                          (value) =>
                            handleEditItemChange(
                              item[primaryKeyField.name],
                              field.name,
                              value
                            ),
                          field.name === primaryKeyField.name // Make primary key readonly during edit
                        )
                      : displayFieldValue(item, field)}
                  </td>
                ))}
                <td className="px-4 py-2">
                  {editingId === item[primaryKeyField.name] ? (
                    <button
                      onClick={() =>
                        handleSave(item[primaryKeyField.name], item)
                      }
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(item[primaryKeyField.name])}
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item[primaryKeyField.name])}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
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
