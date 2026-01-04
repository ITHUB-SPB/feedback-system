import { createFileRoute } from "@tanstack/react-router";
import Button from "antd/es/button";

import { PageHeader } from "@/components/pageHeader";
import TopicAssignModalForm from "@/components/forms/topic-assign-form";
import TopicCategoryTopicsTable from "@/components/tables/topics-table";
import useTopicCategoryTopicCreate from "@/components/hooks/use-topic-category-topic-create";

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
