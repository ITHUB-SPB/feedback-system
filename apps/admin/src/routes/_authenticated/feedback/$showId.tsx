import { createFileRoute } from "@tanstack/react-router";

import { dataProvider } from "../../../providers/data-provider";
import { FeedbackShowPage } from "@/pages/feedback-show";

export const Route = createFileRoute("/_authenticated/feedback/$showId")({
  component: ShowFeedback,
  loader: async ({ context, params }) => {
    const { data: feedback } = await context.queryClient.ensureQueryData({
      queryKey: ["default", "feedback", "one", params.showId],
      queryFn: () =>
        dataProvider.getOne({
          resource: "feedback",
          id: Number(params.showId),
        }),
    });

    return { feedback };
  },
});

function ShowFeedback() {
  const { feedback } = Route.useLoaderData();

  return <FeedbackShowPage feedback={feedback} />;
}
