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
  const [originalData, setOriginalData] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newItem, setNewItem] = useState<any>({});
  const { fetchData, createItem, updateItem, deleteItem, isLoading, error } =
    useApi(endpoint);

  // Get the primary key field (assuming it's the first field)
  const primaryKeyField = fields[0];

  // Determine what the error responses are for when there are issues
  const getErrorResponses = () => {
    // Find fields that must be unique
    const uniqueFields = fields
      .filter((field) => field.unique)
      .map((field) => field.label.toLowerCase());
    const uniqueFieldCount = uniqueFields.length;

    // Set unique error response message depending on number of unique fields
    var uniqueErrorResponse = "";

    if (uniqueFieldCount > 0) {
      uniqueErrorResponse += " Please ensure the ";

      switch (uniqueFieldCount) {
        case 1:
          uniqueErrorResponse += uniqueFields[0] + " is unique.";
          break;
        case 2:
          uniqueErrorResponse +=
            uniqueFields[0] + " and " + uniqueFields[1] + " are unique.";
          break;
        default:
          for (let i = 0; i < uniqueFieldCount - 1; i++) {
            uniqueErrorResponse += uniqueFields[i] + ", ";
          }
          uniqueErrorResponse +=
            "and " + uniqueFields[uniqueFieldCount - 1] + " are unique.";
      }
    }

    // Append unique error response to each error's initial responses
    const errorResponses = {
      add:
        "The " +
        title.toLowerCase() +
        " couldn't be added." +
        uniqueErrorResponse,
      edit:
        "The " +
        title.toLowerCase() +
        " couldn't be edited." +
        uniqueErrorResponse,
    };
    return errorResponses;
  };
  // Store error responses to issues
  const errorResponses = getErrorResponses();

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
    const result = await fetchData(false);
    setData(result);
    setOriginalData(JSON.parse(JSON.stringify(result))); // Deep copy to keep original state
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
    // Store the current state before editing begins
    setOriginalData(JSON.parse(JSON.stringify(data)));
    setEditingId(id);
  };

  const handleCancelEdit = () => {
    // Restore the original data from before the edit
    setData(originalData);
    setEditingId(null);
  };

  // Validate required fields are filled before saving
  const validateItem = (item: any) => {
    // Check that all required fields have values
    const requiredFields = fields.filter(
      (field) => !field.optional && !field.selectNone && !field.readOnly
    );

    for (const field of requiredFields) {
      if (
        item[field.name] === undefined ||
        item[field.name] === "" ||
        item[field.name] === null
      ) {
        return {
          valid: false,
          message: `${field.label} is required.`,
        };
      }
    }

    return { valid: true };
  };

  const handleSave = async (id: number, item: any) => {
    // Process any "__none__" values to null before saving
    const processedItem = { ...item };

    // Find fields with selectNone=true
    const selectNoneFields = fields
      .filter((field) => field.selectNone)
      .map((field) => field.name);

    // Convert "__none__" to null for these fields
    selectNoneFields.forEach((fieldName) => {
      if (processedItem[fieldName] === "__none__") {
        processedItem[fieldName] = null;
      }
    });

    // Validate the item before saving
    const validation = validateItem(processedItem);
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    if (id === -1) {
      // If item couldn't be created, show add error response
      if ((await createItem(processedItem)) == null) {
        alert(errorResponses.add);
      }
    } else {
      // If item couldn't be edited, show edit error response
      if ((await updateItem(id, processedItem)) == null) {
        alert(errorResponses.edit);
      }
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
    // Prevent empty string values from being set (from the placeholder)
    // if (value === "") return;

    setNewItem({ ...newItem, [field]: value });
  };

  const handleEditItemChange = (id: number, field: string, value: any) => {
    // Prevent empty string values from being set (from the placeholder)
    // if (value === "") return;

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

      // If the value is null and selectNone is true, use "__none__" as the value
      let currentValue = value;
      if (value === null && field.selectNone) {
        currentValue = "__none__";
      }

      return (
        <select
          value={currentValue !== undefined ? String(currentValue) : ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border rounded"
          disabled={isReadOnly}
          required={!field.selectNone && !field.optional} // Not required if selectNone or optional is true
        >
          {/* Non-selectable placeholder option */}
          <option value="" disabled className="text-gray-500">
            -- Select a {field.label} --
          </option>

          {/* Add "None" option if selectNone is true */}
          {field.selectNone && <option value="__none__">None</option>}

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
          required={!field.optional}
        />
      );
    }
  };

  // Function to display foreign key values properly
  const displayFieldValue = (item: any, field: Field) => {
    if (field.foreignKey && field.optionsEndpoint) {
      // If the field value is null and selectNone is true, display "None"
      if (item[field.name] === null && field.selectNone) {
        return "None";
      }

      const options =
        foreignKeyOptions.find((option) => option.fieldName === field.name)
          ?.options || [];

      const option = options.find(
        (opt) => opt.value === String(item[field.name])
      );

      return option ? option.label : item[field.name];
    }

    return item[field.name];
  };

  // Formats the label for a field
  const getFieldLabel = (field: Field) => {
    // Add * if required field
    var fieldLabel =
      field.selectNone || field.optional ? field.label : field.label + " *";

    return fieldLabel;
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
                  {getFieldLabel(field)}
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
                    <>
                      <button
                        onClick={() =>
                          handleSave(item[primaryKeyField.name], item)
                        }
                        className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleCancelEdit()}
                        className="bg-gray-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Cancel
                      </button>
                    </>
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
