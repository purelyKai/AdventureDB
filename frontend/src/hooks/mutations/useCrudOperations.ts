import { useState, useCallback } from "react";
import useDataQuery, { UseDataQueryResult } from "../queries/useDataQuery";
import useForeignKeyOptions, {
  Field,
  UseForeignKeyOptionsResult,
} from "./useForeignKeyOptions";
import useCrudMutation, { UseCrudMutationResult } from "./useCrudMutation";

export interface RecordData {
  id: number;
  [key: string]: any;
}

// New type for creation operations that doesn't require an ID
export type CreateRecordData = Omit<RecordData, "id">;

export interface UseCrudOperationsResult {
  // Data
  data: RecordData[];
  isLoadingData: boolean;
  dataError: Error | null;
  foreignKeyOptions: Record<string, { value: string; label: string }[]>;

  // State
  newRecord: CreateRecordData;
  editRecord: RecordData | null;

  // Loading states
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isLoadingOptions: boolean;

  // Errors
  createError: Error | null;
  updateError: Error | null;
  deleteError: Error | null;
  optionsError: Error | null;

  // Handlers
  handleInputChange: (field: string, value: any) => void;
  handleEditInputChange: (field: string, value: any) => void;
  handleCreate: () => Promise<void>;
  handleEdit: (record: RecordData) => void;
  handleConfirmEdit: () => Promise<void>;
  handleCancelEdit: () => void;
  handleDelete: (recordId: number) => Promise<void>;
  refetchData: () => Promise<void>;
}

function useCrudOperations(
  endpoint: string,
  fields: Field[]
): UseCrudOperationsResult {
  // State for handling form data
  const [newRecord, setNewRecord] = useState<CreateRecordData>({});
  const [editRecord, setEditRecord] = useState<RecordData | null>(null);

  // Fetch main data
  const {
    data,
    isLoading: isLoadingData,
    error: dataError,
    refetch: refetchData,
  }: UseDataQueryResult<RecordData> = useDataQuery<RecordData>({ endpoint });

  // Fetch foreign key options
  const {
    foreignKeyOptions,
    isLoading: isLoadingOptions,
    error: optionsError,
  }: UseForeignKeyOptionsResult = useForeignKeyOptions(fields);

  // Create mutation
  const createMutation: UseCrudMutationResult<RecordData> =
    useCrudMutation<RecordData>({
      endpoint,
      method: "POST",
      onSuccess: refetchData,
    });

  // Update mutation
  const updateMutation: UseCrudMutationResult<RecordData> =
    useCrudMutation<RecordData>({
      endpoint,
      method: "PUT",
      onSuccess: refetchData,
    });

  // Delete mutation
  const deleteMutation: UseCrudMutationResult<RecordData> =
    useCrudMutation<RecordData>({
      endpoint,
      method: "DELETE",
      onSuccess: refetchData,
    });

  // Handler functions
  const handleInputChange = useCallback((field: string, value: any): void => {
    setNewRecord((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleEditInputChange = useCallback(
    (field: string, value: any): void => {
      if (editRecord) {
        setEditRecord((prev) => ({ ...prev!, [field]: value }));
      }
    },
    [editRecord]
  );

  const handleCreate = async (): Promise<void> => {
    // We need to use type assertion or modify the useCrudMutation type to accept CreateRecordData
    const success = await createMutation.mutate(newRecord as any);
    if (success) {
      setNewRecord({});
    }
  };

  const handleEdit = useCallback((record: RecordData): void => {
    setEditRecord({ ...record });
  }, []);

  const handleConfirmEdit = async (): Promise<void> => {
    if (editRecord) {
      const success = await updateMutation.mutate(editRecord, editRecord.id);
      if (success) {
        setEditRecord(null);
      }
    }
  };

  const handleCancelEdit = useCallback((): void => {
    setEditRecord(null);
  }, []);

  const handleDelete = async (recordId: number): Promise<void> => {
    await deleteMutation.mutate(undefined, recordId);
  };

  return {
    // Data
    data,
    isLoadingData,
    dataError,
    foreignKeyOptions,

    // State
    newRecord,
    editRecord,

    // Loading states
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
    isLoadingOptions,

    // Errors
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
    optionsError,

    // Handlers
    handleInputChange,
    handleEditInputChange,
    handleCreate,
    handleEdit,
    handleConfirmEdit,
    handleCancelEdit,
    handleDelete,
    refetchData,
  };
}

export default useCrudOperations;
