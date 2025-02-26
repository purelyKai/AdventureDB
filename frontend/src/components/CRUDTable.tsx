import React from "react";
import useCrudOperations, {
  RecordData,
  UseCrudOperationsResult,
} from "../hooks/mutations/useCrudOperations";

export interface Field {
  name: string;
  label: string;
  type: string;
  readOnly?: boolean;
  foreignKey?: boolean;
  optionsEndpoint?: string;
}

export interface CRUDTableProps {
  title: string;
  endpoint: string;
  fields: Field[];
}

const CRUDTable: React.FC<CRUDTableProps> = ({ title, endpoint, fields }) => {
  const {
    data,
    isLoadingData,
    isLoadingOptions,
    foreignKeyOptions,
    newRecord,
    editRecord,
    isCreating,
    isUpdating,
    isDeleting,
    dataError,
    createError,
    updateError,
    deleteError,
    handleInputChange,
    handleEditInputChange,
    handleCreate,
    handleEdit,
    handleConfirmEdit,
    handleCancelEdit,
    handleDelete,
  }: UseCrudOperationsResult = useCrudOperations(endpoint, fields);

  // Display loading state
  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center h-40">
        Loading data...
      </div>
    );
  }

  // Display error state
  if (dataError) {
    return (
      <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
        <p>Error loading data: {dataError.message}</p>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:w-1/3 p-4 border rounded shadow-lg">
        <h2 className="text-lg font-bold mb-2">Add New {title}</h2>

        {/* Display create error if any */}
        {createError && (
          <div className="mb-4 p-2 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm">
            {createError.message}
          </div>
        )}

        {/* Form fields */}
        {fields
          .filter((field) => !field.readOnly)
          .map((field) => (
            <div key={field.name} className="mb-2">
              <label className="block text-sm font-medium mb-1">
                {field.label}
              </label>
              {field.foreignKey ? (
                <div>
                  {isLoadingOptions ? (
                    <div className="text-gray-500 text-sm">
                      Loading options...
                    </div>
                  ) : (
                    <select
                      value={newRecord[field.name] || ""}
                      onChange={(e) =>
                        handleInputChange(field.name, e.target.value)
                      }
                      className="w-full p-2 border rounded"
                      disabled={isCreating}
                    >
                      <option value="">Select {field.label}</option>
                      {foreignKeyOptions[field.name]?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ) : (
                <input
                  type={field.type}
                  value={newRecord[field.name] || ""}
                  onChange={(e) =>
                    handleInputChange(field.name, e.target.value)
                  }
                  className="w-full p-2 border rounded"
                  placeholder={field.label}
                  disabled={isCreating}
                />
              )}
            </div>
          ))}

        {/* Create button */}
        <button
          onClick={handleCreate}
          disabled={isCreating}
          className={`w-full px-4 py-2 ${
            isCreating ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
          } text-white rounded transition-colors`}
        >
          {isCreating ? "Creating..." : "Create"}
        </button>
      </div>

      {/* Table section */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>

        {/* Delete error */}
        {deleteError && (
          <div className="mb-4 p-2 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm">
            {deleteError.message}
          </div>
        )}

        {/* Update error */}
        {updateError && (
          <div className="mb-4 p-2 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm">
            {updateError.message}
          </div>
        )}

        {/* Data table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-2 text-center w-12">
                  <span className="text-red-500 font-bold">X</span>
                </th>
                {fields.map((field) => (
                  <th key={field.name} className="border p-2 text-left">
                    {field.label}
                  </th>
                ))}
                <th className="border p-2 w-24 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={fields.length + 2}
                    className="border p-4 text-center text-gray-500"
                  >
                    No data available
                  </td>
                </tr>
              ) : (
                data.map((record: RecordData) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="border p-2 text-center">
                      <button
                        onClick={() => handleDelete(record.id)}
                        disabled={isDeleting}
                        className={`px-2 py-1 ${
                          isDeleting
                            ? "bg-red-300"
                            : "bg-red-500 hover:bg-red-600"
                        } text-white rounded transition-colors`}
                        aria-label="Delete"
                      >
                        X
                      </button>
                    </td>
                    {fields.map((field) => (
                      <td key={field.name} className="border p-2">
                        {editRecord && editRecord.id === record.id ? (
                          field.foreignKey ? (
                            <select
                              value={editRecord[field.name] || ""}
                              onChange={(e) =>
                                handleEditInputChange(
                                  field.name,
                                  e.target.value
                                )
                              }
                              className="w-full p-1 border rounded"
                              disabled={isUpdating}
                            >
                              <option value="">Select {field.label}</option>
                              {foreignKeyOptions[field.name]?.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={field.type}
                              value={editRecord[field.name] || ""}
                              onChange={(e) =>
                                handleEditInputChange(
                                  field.name,
                                  e.target.value
                                )
                              }
                              className="w-full p-1 border rounded"
                              readOnly={field.readOnly}
                              disabled={isUpdating || field.readOnly}
                            />
                          )
                        ) : (
                          <span>{record[field.name]}</span>
                        )}
                      </td>
                    ))}
                    <td className="border p-2 text-center">
                      {editRecord && editRecord.id === record.id ? (
                        <>
                          <button
                            onClick={handleConfirmEdit}
                            disabled={isUpdating}
                            className={`px-2 py-1 ${
                              isUpdating
                                ? "bg-green-300"
                                : "bg-green-500 hover:bg-green-600"
                            } text-white rounded transition-colors mr-2`}
                          >
                            {isUpdating ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={isUpdating}
                            className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEdit(record)}
                          className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CRUDTable;
