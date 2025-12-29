import { createFileRoute } from "@tanstack/react-router";
import { FeedbackListPage } from "@/pages/feedback-list";

export const Route = createFileRoute("/_authenticated/feedback/")({
  loader: async ({ context }) => {
    const { data } = await context.authClient.getSession();
    return { user: data?.user };
  },
  component: ListFeedback,
});

function ListFeedback() {
  const { user } = Route.useLoaderData();

  return <FeedbackListPage user={user} />;
}
