import Tag from "antd/es/tag";
import Flex from "antd/es/flex";

import { Show, ListButton } from "@/core/refine-antd";
import type { FeedbackContract, User } from "@/types";

import ContentModerator from "./components/content-moderator";
import ContentOfficial from "./components/content-official";
import { ActionButtons } from "./components/action-buttons";
import useUpdateStatus from "./hooks/useUpdateStatus";
import { getStatusColor } from "./lib/statusColor";
import { Link } from "@tanstack/react-router";

type PageProps = {
  feedback: FeedbackContract["outputs"]["one"],
  user: User | undefined
}

export default function FeedbackShowPage({ feedback, user }: PageProps) {
  const updateStatus = useUpdateStatus(Number(feedback?.id))

  return (
    <Show
      title={
        <Flex align="center" gap={18}>
          Обращение №{feedback?.id}
          <Tag color={getStatusColor(feedback.status.title)}>
            {feedback.status.translation}
          </Tag>
        </Flex>
      }
      headerButtons={
        <Link to="/feedback">
          <ListButton resource="feedback" />
        </Link>
      }
      footerButtons={
        <ActionButtons
          updateStatus={updateStatus}
          availableActions={feedback?.availableActions}
        />
      }
    >
      {user?.role === "official" ? <ContentOfficial feedback={feedback} /> : <ContentModerator feedback={feedback} />}
    </Show>
  )
}
