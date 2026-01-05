import { useEditableTable } from "@/components/table/use-editable-table";

export default function useAdministrativeUnitsTable() {
  const {
    tableProps,
    formProps,
    isEditing,
    sorters,
    setId,
    saveButtonProps,
    cancelButtonProps,
    editButtonProps,
  } = useEditableTable({
    resource: "administrative_units",
    pagination: { currentPage: 1, pageSize: 24, mode: "server" },
    sorters: {
      initial: [
        {
          field: "title",
          order: "asc",
        },
      ],
    },
  });

  return {
    tableProps,
    formProps,
    isEditing,
    sorters,
    setId,
    saveButtonProps,
    cancelButtonProps,
    editButtonProps,
  };
}
