import { useTable } from "@/components/table/use-table";

export default function useTopicCategoryTopicsTable() {
  const { tableProps, sorters, filters } = useTable({
    resource: "topic_category_topics",
    pagination: { currentPage: 1, pageSize: 24, mode: "server" },
    sorters: {
      initial: [{ field: "topic_category_id", order: "asc" }],
    },
    filters: {
      initial: [],
    },
  });

  return {
    tableProps,
    sorters,
    filters,
  };
}
