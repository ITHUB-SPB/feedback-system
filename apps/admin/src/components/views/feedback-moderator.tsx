import Typography from "antd/es/typography";
import Card from "antd/es/card";
import Divider from "antd/es/divider";
import Flex from "antd/es/flex";
import Image from "antd/es/image";

import { TextField } from "@/core/refine-antd";
import type { FeedbackContract } from "@/types";

type ContentProps = {
  feedback: FeedbackContract["outputs"]["one"];
};

export default function FeedbackModerator({ feedback }: ContentProps) {
  const images = feedback?.image_links || [];

  return (
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
                {images.map((image: string, index: number) => (
                  <Image
                    key={`image_${index}`}
                    height={100}
                    src={image}
                    preview={{ getContainer: "#root" }}
                  />
                ))}
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
              <Typography.Text type="secondary" style={{ textAlign: "center" }}>
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
        <Typography.Title level={4}>Объект</Typography.Title>

        <Typography.Title level={5}>Территория</Typography.Title>
        <TextField value={feedback?.administrative_unit_title || "—"} />

        <Typography.Title level={5}>Проект</Typography.Title>
        <TextField value={feedback?.project} />

        <Typography.Title level={5}>Ответственный</Typography.Title>
        <TextField value={feedback?.responsible_person_full_name || "—"} />

        <Divider />

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
  );
}
