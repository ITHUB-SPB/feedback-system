import { useEditableTable } from "@/components/table/use-editable-table";
import type { VotingUnitContract } from "@/types";

export default function useVotingUnitsTable() {
  const {
    tableProps,
    formProps,
    isEditing,
    setId,
    saveButtonProps,
    cancelButtonProps,
    editButtonProps,
    sorters,
  } = useEditableTable<VotingUnitContract["all"]>({
    resource: "voting_units",
    pagination: { currentPage: 1, pageSize: 48, mode: "server" },
    sorters: {
      initial: [
        {
          field: "voting_region",
          order: "asc",
        },
        {
          field: "title",
          order: "asc",
        },
      ],
    },
    filters: {
      initial: [],
    },
  });

  return {
    tableProps,
    formProps,
    isEditing,
    setId,
    saveButtonProps,
    cancelButtonProps,
    editButtonProps,
    sorters,
  };
}
