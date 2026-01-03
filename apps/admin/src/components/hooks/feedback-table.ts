import { useLoaderData } from "@tanstack/react-router";

import { useTable } from "@/core/refine-antd";

import type { FeedbackContract } from "@/types";

export default function useFeedbackTable() {
  const { context } = useLoaderData({ from: "/_authenticated" });
  const { user } = context.session;

  const { tableProps, sorters, filters } = useTable<
    FeedbackContract["outputs"]["all"][0]
  >({
    resource: "feedback",
    pagination: { currentPage: 1, pageSize: 12, mode: "server" },
    sorters: {
      initial: [{ field: "created_at", order: "desc" }],
    },
    filters: {
      permanent:
        user?.role === "official"
          ? [
            {
              field: "official_id",
              operator: "eq",
              value: user?.id,
            },
          ]
          : [],
      initial: [
        {
          field: "status.id",
          operator: "in",
          value: user?.role === "official" ? [1, 2, 4, 6] : [1, 2, 3, 4, 6, 7],
        },
      ],
    },
  });

  return {
    tableProps,
    sorters,
    filters,
  };
}
