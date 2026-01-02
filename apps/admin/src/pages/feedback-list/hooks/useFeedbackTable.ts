import { getRouteApi } from "@tanstack/react-router";

import {
  useSelectFromQuery, useTable
} from "@/core/refine-antd";

import type { FeedbackContract } from "@/types";
import type { FeedbackTypeContract, FeedbackStatusContract } from "@/types";


export default function useFeedbackTable() {
  const routeApi = getRouteApi("/_authenticated/feedback/")
  const { user, feedbackStatuses, feedbackTypes } = routeApi.useLoaderData()

  const { tableProps, sorters, filters } = useTable<FeedbackContract["outputs"]["all"][0]>({
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

  const { selectProps: feedbackTypeSelectProps } = useSelectFromQuery<
    FeedbackTypeContract["all"][0],
    { label: string, value: number }
  >({
    data: feedbackTypes,
    optionLabel: "title",
    optionValue: "id",
  });

  const { selectProps: feedbackStatusSelectProps } = useSelectFromQuery<
    FeedbackStatusContract["all"][0],
    { label: string, value: number }
  >({
    data: feedbackStatuses,
    optionLabel: "translation",
    optionValue: "id",
  });


  return {
    table: {
      tableProps,
      sorters,
      filters,
    },
    feedbackTypeSelectProps,
    feedbackStatusSelectProps
  };
}
