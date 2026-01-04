import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/pageHeader";
import FeedbackTable from "@/components/tables/feedback-table";

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
    return (
      <PageHeader title="Предложения граждан">
        <FeedbackTable />
      </PageHeader>
    );
  },
});
