import { useTable } from "@/components/table/use-table";

export default function useCitizensTable() {
  const { tableProps, sorters } = useTable({
    resource: "officials",
    pagination: { currentPage: 1, pageSize: 24, mode: "server" },
    sorters: {
      initial: [
        {
          field: "lastName",
          order: "asc",
        },
      ],
    },
    filters: {
      initial: [
        {
          field: "role",
          operator: "eq",
          value: "citizen",
        },
      ],
    },
  });

  return {
    tableProps,
    sorters,
  };
}
