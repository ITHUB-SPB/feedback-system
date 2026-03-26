import { createFileRoute } from "@tanstack/react-router";

import Segmented from "antd/es/segmented";

import { PageHeader } from "@/components/page-header";
import FeedbackTable from "@/tables/feedback-table";
import useFeedbackTable from "@/hooks/use-feedback-table";

export const Route = createFileRoute("/_authenticated/feedback/")({
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData(
      context.orpcClient.feedbackType.all.queryOptions({
        input: {},
      }),
    );

    context.queryClient.ensureQueryData(
      context.orpcClient.feedbackStatus.all.queryOptions({
        input: {},
      }),
    );
  },
  component: () => {
    const {
      context: { session },
    } = Route.parentRoute.useLoaderData();

    const table = useFeedbackTable();

    return (
      <PageHeader
        title="Предложения граждан"
        extra={
          <Segmented
            options={[
              { label: "Все", value: "all" },
              { label: "Замечания", value: "issues" },
            ]}
            onChange={(value) => {
              table.setFilters((currentFilters) => {
                if (value === "issues") {
                  return [
                    ...currentFilters,
                    {
                      field: "feedback_type_id",
                      operator: "eq",
                      value: 2,
                    },
                  ];
                } else {
                  const updatedFilters = [...currentFilters];
                  const existingFilterIx = updatedFilters.findIndex(
                    (filterItem) => filterItem.field === "feedback_type_id",
                  );
                  if (existingFilterIx !== -1) {
                    updatedFilters.splice(existingFilterIx, 1);
                  }
                  return updatedFilters;
                }
              });
            }}
          />
        }
      >
        <FeedbackTable table={table} role={session.role} />
      </PageHeader>
    );
  },
});
