import {
    useTable,
    useSelect,
} from "@/core/refine-antd";
import type { ProjectContract, AdministrativeUnitContract } from "@/types";


export default function useProjectsTable() {
    const { tableProps, sorters, filters } = useTable<ProjectContract["all"][0]>({
        resource: "projects",
        pagination: { currentPage: 1, pageSize: 12, mode: "server" },
        sorters: {
            initial: [
                { field: "year_of_completion", order: "desc" },
                { field: "title", order: "asc" },
            ],
        },
    });

    const { selectProps: administrativeUnitsSelectProps } = useSelect<AdministrativeUnitContract["all"][0]>({
        resource: "administrative_units",
    });

    return {
        table: {
            tableProps, sorters, filters
        },
        administrativeUnitsSelectProps
    }
}