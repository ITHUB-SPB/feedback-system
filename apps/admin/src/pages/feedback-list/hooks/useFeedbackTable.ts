import { useMany } from "@refinedev/core";
import { useTable, getDefaultFilter, useSelect } from "@refinedev/antd";

import type { ProjectRecord } from "../types";

export default function useFeedbackTable(userId?: string, role?: string) {
    const { tableProps, sorters, filters } = useTable({
        resource: "feedback",
        pagination: { currentPage: 1, pageSize: 12 },
        sorters: {
            initial: [
                { field: "created_at", order: "desc" },
            ],
        },
        filters: {
            permanent:
                role === "official"
                    ? [
                        {
                            field: "official_id",
                            operator: "eq",
                            value: userId,
                        },
                    ]
                    : [],
            initial:
                [
                    {
                        field: "status.id",
                        operator: "in",
                        value: role === "official" ? [1, 2, 4, 6] : [1, 2, 3, 4, 6, 7]
                    }
                ]
        },
    });

    const { result: projects, query: projectsQuery } = useMany<ProjectRecord>({
        resource: "projects",
        ids: tableProps?.dataSource?.map((feedback) => feedback.project_id) ?? [],
    });

    const { selectProps: feedbackTypeSelectProps } = useSelect({
        resource: "feedback_types",
        optionLabel: "title",
        optionValue: "id",
        pagination: {
            pageSize: 48,
        },
        defaultValue: getDefaultFilter("feedback_type_id", filters, "eq"),
    });

    const { selectProps: feedbackStatusSelectProps } = useSelect({
        resource: "feedback_statuses",
        optionLabel: "translation",
        optionValue: "id",
        pagination: {
            pageSize: 48,
        },
        defaultValue: getDefaultFilter("status.id", filters, "in"),
    });

    return {
        table: {
            tableProps,
            sorters,
            filters,
        },
        projects: {
            projects,
            projectsQuery,
        },
        select: {
            feedbackTypeSelectProps,
            feedbackStatusSelectProps,
        },
    };
}
