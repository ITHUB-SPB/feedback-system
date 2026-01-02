import { createFileRoute } from "@tanstack/react-router";
import FeedbackListPage from "@/pages/feedback-list";
import { dataProvider } from '@/providers/data-provider'
import type { FeedbackTypeContract, FeedbackStatusContract } from "@/types";

export const Route = createFileRoute("/_authenticated/feedback/")({
  loader: async ({ context }) => {
    const { data: feedbackTypes } = await context.queryClient.ensureQueryData({
      queryKey: ["default", "feedback_types", "many"],
      queryFn: () =>
        dataProvider.getList<FeedbackTypeContract["all"][0]>({
          resource: "feedback_types",
        }),
    });

    const { data: feedbackStatuses } = await context.queryClient.ensureQueryData({
      queryKey: ["default", "feedback_statuses", "many"],
      queryFn: () =>
        dataProvider.getList<FeedbackStatusContract["all"][0]>({
          resource: "feedback_statuses",
        }),
    });

    const { data: session } = await context.authClient.getSession();

    return { user: session?.user, feedbackTypes, feedbackStatuses };
  },
  component: FeedbackListPage,
});
