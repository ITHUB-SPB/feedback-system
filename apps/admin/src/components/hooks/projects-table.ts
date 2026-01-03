import { useTable } from "@/core/refine-antd";

import type { ProjectContract } from "@/types";

export default function useProjectsTable() {
    const { tableProps, sorters, filters } = useTable<
        ProjectContract["all"][0]
    >({
        resource: "projects",
        pagination: { currentPage: 1, pageSize: 12, mode: "server" },
        sorters: {
            initial: [
                { field: "year_of_completion", order: "desc" },
                { field: "title", order: "asc" },
            ],
        },
    });

    return {
        tableProps,
        sorters,
        filters,
    };
}
