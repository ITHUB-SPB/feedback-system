import { createFileRoute } from "@tanstack/react-router";

import Button from "antd/es/button";
import Space from "antd/es/space";

import { List } from "../../../components/crud/list";
import { useTopicCategoryTopic } from "./hooks";
import ModalForm from "./modal-form";
import CategoryTopicsTable from "./table";

export const Route = createFileRoute("/_authenticated/topic_category_topics/")({
  component: ListTopicCategoryTopics,
});

function ListTopicCategoryTopics() {
  const { modal, table, topicCategories, topics } = useTopicCategoryTopic();

  return (
    <>
      <List
        title="Категории"
        createButtonProps={{
          hidden: true,
        }}
        headerButtons={() => (
          <Space>
            <Button
              onClick={() => {
                modal.createTopicCategoryTopicModalShow();
              }}
              type="dashed"
            >
              Прикрепить топик к категории
            </Button>
          </Space>
        )}
      >
        <CategoryTopicsTable
          table={table}
          topics={topics}
          topicCategories={topicCategories}
        />
      </List>
      <ModalForm
        topicCategoryTopicModalProps={modal.topicCategoryTopicModalProps}
        topicCategoryTopicFormProps={modal.topicCategoryTopicFormProps}
        topicCategoriesSelectProps={topicCategories.topicCategoriesSelectProps}
        topicsSelectProps={topics.topicsSelectProps}
      />
    </>
  );
}
