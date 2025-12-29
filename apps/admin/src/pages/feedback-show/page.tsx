import { useUpdate } from "@refinedev/core";
import { ListButton } from "@refinedev/antd";
import { useGetIdentity } from "@refinedev/core";

import Tag from "antd/es/tag";
import Typography from "antd/es/typography";
import Card from "antd/es/card";
import Divider from "antd/es/divider";
import Flex from "antd/es/flex";
import Image from "antd/es/image";

import { TextField } from "../../components/fields/text";
import { Show } from "../../components/crud/show";
import { getStatusColor } from "./lib/statusColor";
import { ActionButtons } from "./lib/actionButtons";
import type { FeedbackShowPageProps } from "./types";

export default function FeedbackShowPage({ feedback }: FeedbackShowPageProps) {
  const { data: user } = useGetIdentity();

  const { mutate: updateStatus } = useUpdate({
    resource: "feedback",
    id: Number(feedback?.id),
    successNotification: false,
    errorNotification: false,
  });

  const images: string[] = feedback?.image_links || [];

  return (
    <Show
      title={
        <Flex align="center" gap={18}>
          Обращение №{feedback?.id}
          <Tag color={getStatusColor(feedback?.status.title)}>
            {feedback?.status.translation}
          </Tag>
        </Flex>
      }
      headerButtons={({ listButtonProps }) => (
        <ListButton {...listButtonProps} />
      )}
    >
      <Flex align="stretch" gap={40}>
        <Card
          variant="borderless"
          style={{ flex: 1, boxShadow: "none", gap: 24 }}
        >
          <Flex vertical>
            <Typography.Title level={4}>
              {feedback?.topic
                ? `${feedback?.feedback_type} (${feedback.topic})`
                : feedback.feedback_type}{" "}
            </Typography.Title>

            {user?.role === "official" ? (
              <>
                <Typography.Title level={5}>Объект</Typography.Title>
                <TextField value={feedback?.project} />
              </>
            ) : null}

            <Typography.Title level={5}>Описание</Typography.Title>
            <Typography.Paragraph
              ellipsis={{
                rows: 10,
                expandable: true,
                symbol: "Читать полностью",
              }}
              style={{ marginBottom: 24 }}
            >
              {feedback?.description}
            </Typography.Paragraph>

            {images.length > 0 ? (
              <Flex gap={16}>
                <Image.PreviewGroup>
                  {images.map((image: string, index: number) => {
                    return (
                      <Image
                        key={`image_${index}`}
                        height={100}
                        src={image}
                        preview={{ getContainer: "#root" }}
                      />
                    );
                  })}
                </Image.PreviewGroup>
              </Flex>
            ) : (
              <div
                style={{
                  height: 120,
                  width: 160,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                  border: "2px dashed #d9d9d9",
                }}
              >
                <Typography.Text
                  type="secondary"
                  style={{ textAlign: "center" }}
                >
                  Фотографии не прикреплены
                </Typography.Text>
              </div>
            )}
          </Flex>
        </Card>

        <Card
          variant={"borderless"}
          style={{
            boxShadow: "none",
            flexBasis: "40%",
          }}
        >
          {user?.role === "moderator" ? (
            <>
              <Typography.Title level={4}>Объект</Typography.Title>

              <Typography.Title level={5}>Территория</Typography.Title>
              <TextField value={feedback?.administrative_unit_title || "—"} />

              <Typography.Title level={5}>Проект</Typography.Title>
              <TextField value={feedback?.project} />

              <Typography.Title level={5}>Ответственный</Typography.Title>
              <TextField
                value={feedback?.responsible_person_full_name || "—"}
              />

              <Divider />
            </>
          ) : null}

          <Typography.Title level={4}>Респондент</Typography.Title>

          <Typography.Title level={5}>ФИО</Typography.Title>
          <TextField value={feedback?.person_full_name || "—"} />

          <Typography.Title level={5}>Контактные данные</Typography.Title>

          {!feedback?.email && !feedback?.person_phone ? (
            <Typography.Paragraph>—</Typography.Paragraph>
          ) : null}

          {feedback?.email ? (
            <Typography.Paragraph>feedback.email</Typography.Paragraph>
          ) : null}

          {feedback?.person_phone ? (
            <Typography.Paragraph>{feedback.person_phone}</Typography.Paragraph>
          ) : null}

          <Typography.Title level={5}>Дата обращения</Typography.Title>
          <TextField
            value={new Date(feedback?.created_at).toLocaleString("ru-RU")}
          />
        </Card>
      </Flex>

      <Divider />

      <ActionButtons
        updateStatus={updateStatus}
        availableActions={feedback?.availableActions}
      />
    </Show>
  );
}
