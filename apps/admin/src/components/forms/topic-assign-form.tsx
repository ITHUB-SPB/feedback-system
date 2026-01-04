import Modal from "antd/es/modal";
import Form from "antd/es/form";
import Select from "antd/es/select";

import type { UseModalFormReturnType } from "@/core/refine-antd";

import useTopics from "@/components/hooks/use-topics";
import useTopicCategories from "@/components/hooks/use-topic-categories";
import type { TopicCategoryTopicContract } from "@/types";

export type TopicAssignModalFormProps = {
  topicCategoryTopicModalProps: UseModalFormReturnType<
    TopicCategoryTopicContract["create"]
  >["modalProps"];
  topicCategoryTopicFormProps: UseModalFormReturnType<
    TopicCategoryTopicContract["create"]
  >["formProps"];
};

export default function TopicAssignModalForm({
  topicCategoryTopicModalProps,
  topicCategoryTopicFormProps,
}: TopicAssignModalFormProps) {
  const topics = useTopics();
  const topicCategories = useTopicCategories();

  return (
    <Modal
      {...topicCategoryTopicModalProps}
      title="Создание связи категории и топика"
      width={480}
      okText="Сохранить"
      cancelText="Отмена"
    >
      <Form {...topicCategoryTopicFormProps} layout="vertical">
        <Form.Item
          label="Категория"
          name="topic_category_id"
          rules={[
            {
              required: true,
              message: "Пожалуйста, выберите категорию",
            },
          ]}
        >
          <Select
            {...topicCategories.selectProps}
            loading={topicCategories.isLoading}
          >
            {topicCategories.selectProps?.options?.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Топик"
          name="topic_id"
          rules={[
            {
              required: true,
              message: "Пожалуйста, выберите топик",
            },
          ]}
        >
          <Select loading={topics.isLoading} {...topics.selectProps}>
            {topics.selectProps?.options?.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
