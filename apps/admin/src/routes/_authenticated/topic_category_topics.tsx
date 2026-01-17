import { createFileRoute } from "@tanstack/react-router";
import Button from "antd/es/button";

import { PageHeader } from "@/components/page-header";
import TopicAssignModalForm from "@/forms/topic-assign-form";
import TopicCategoryTopicsTable from "@/tables/topics-table";
import useTopicCategoryTopicCreate from "@/hooks/use-topic-category-topic-create";

export const Route = createFileRoute("/_authenticated/topic_category_topics")({
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData(
      context.orpcClient.topic.all.queryOptions({
        input: {},
      }),
    );

    context.queryClient.ensureQueryData(
      context.orpcClient.topicCategory.all.queryOptions({
        input: {},
      }),
    );

    context.queryClient.ensureQueryData(
      context.orpcClient.topicCategoryTopic.all.queryOptions({
        input: {
          sort: [
            {
              field: "topic_category_id",
              order: "asc",
            },
          ],
        },
      }),
    );
  },
  component: ListTopicCategoryTopics,
});

function ListTopicCategoryTopics() {
  const modal = useTopicCategoryTopicCreate();

  return (
    <>
      <PageHeader
        title="Категории"
        extra={
          <Button
            onClick={() => {
              modal.createTopicCategoryTopicModalShow();
            }}
            type="dashed"
          >
            Прикрепить топик к категории
          </Button>
        }
      >
        <TopicCategoryTopicsTable />
      </PageHeader>
      <TopicAssignModalForm
        topicCategoryTopicModalProps={modal.topicCategoryTopicModalProps}
        topicCategoryTopicFormProps={modal.topicCategoryTopicFormProps}
      />
    </>
  );
}
