import { createFileRoute } from "@tanstack/react-router";

import { dataProvider } from "@/providers/data-provider";
import FeedbackShowPage from "@/pages/feedback-show";
import type { FeedbackContract } from "@/types";

type FeedbackRecord = FeedbackContract["outputs"]["one"]

export const Route = createFileRoute("/_authenticated/feedback/$showId")({
  loader: async ({ context, params }) => {
    const { data: feedback } = await context.queryClient.ensureQueryData({
      queryKey: ["default", "feedback", "one", params.showId],
      queryFn: () =>
        dataProvider.getOne<FeedbackRecord>({
          resource: "feedback",
          id: Number(params.showId),
        }),
    });

    const { data: session } = await context.authClient.getSession();

    return { feedback, user: session?.user };
  },
  component: () => {
    const { feedback, user } = Route.useLoaderData();

    return <FeedbackShowPage feedback={feedback} user={user} />;
  },
});
