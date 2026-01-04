import { useTable } from "@/core/refine-antd";

export default function useVotingVotesTable() {
  const { tableProps, sorters, filters } = useTable({
    pagination: { currentPage: 1, pageSize: 24, mode: "server" },
    sorters: {
      initial: [{ field: "created_at", order: "desc" }],
    },
  });

  return {
    tableProps,
    sorters,
    filters,
  };
}
