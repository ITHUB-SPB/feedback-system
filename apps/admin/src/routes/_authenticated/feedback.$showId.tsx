import { createFileRoute } from "@tanstack/react-router";

import Tag from "antd/es/tag";
import Flex from "antd/es/flex";

import { Show } from "@/components/layouts";
import { ActionButtons } from "@/components/buttons";
import FeedbackModerator from "@/components/views/feedback-moderator";
import FeedbackOfficial from "@/components/views/feedback-official";
import { getStatusColor } from "@/components/lib/statusColor";
import useUpdateFeedackStatus from "@/components/hooks/use-feedback-status-update";
import { useFeedbackOne } from "@/components/hooks/use-feedback";

export const Route = createFileRoute("/_authenticated/feedback/$showId")({
  params: {
    parse: (p) => ({
      showId: Number(p.showId),
    }),
  },
  loader: async ({ context, params }) => {
    context.queryClient.ensureQueryData(
      context.orpcClient.feedback.one.queryOptions({
        input: {
          id: params.showId,
        },
      }),
    );
  },
  component: () => {
    const { showId } = Route.useParams();
    const {
      context: { session },
    } = Route.parentRoute.useLoaderData();

    const { data: feedback } = useFeedbackOne(showId);
    const updateStatus = useUpdateFeedackStatus(showId);

    return (
      <Show
        resource="feedback"
        recordItemId={showId}
        title={
          <Flex align="center" gap={18}>
            Обращение №{feedback.id}
            <Tag color={getStatusColor(feedback.status.title)}>
              {feedback.status.translation}
            </Tag>
          </Flex>
        }
        footerButtons={
          <ActionButtons
            updateStatus={updateStatus}
            availableActions={feedback.availableActions}
          />
        }
      >
        {session.role === "official" ? (
          <FeedbackOfficial feedback={feedback} />
        ) : (
          <FeedbackModerator feedback={feedback} />
        )}
      </Show>
    );
  },
});
