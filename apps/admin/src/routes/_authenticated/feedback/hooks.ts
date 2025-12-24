import { useMany, useGetIdentity } from "@refinedev/core";

import { useTable, getDefaultFilter, useSelect } from "@refinedev/antd";

import type { ProjectRecord } from "./types";

export function useFeedbackTable(userId?: string, role?: string) {
  const { tableProps, sorters, filters } = useTable({
    resource: "feedback",
    pagination: { currentPage: 1, pageSize: 12 },
    sorters: {
      initial: [
        { field: "feedback_status_id", order: "desc" },
        { field: "created_at", order: "asc" },
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
        role === "official"
          ? [
              {
                field: "feedback_status_id",
                operator: "in",
                value: [1, 2, 4],
              },
            ]
          : [],
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
    optionLabel: "title",
    optionValue: "id",
    pagination: {
      pageSize: 48,
    },
    defaultValue: getDefaultFilter("feedback_status_id", filters, "eq"),
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
