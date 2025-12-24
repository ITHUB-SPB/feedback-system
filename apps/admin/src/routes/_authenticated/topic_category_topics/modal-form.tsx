import Modal from "antd/es/modal";
import Form from "antd/es/form";
import Select from "antd/es/select";

import type { ModalFormProps } from "./types";

export default function ModalForm({
  topicCategoryTopicModalProps,
  topicCategoryTopicFormProps,
  topicCategoriesSelectProps,
  topicsSelectProps,
}: ModalFormProps) {
  return (
    <Modal
      {...topicCategoryTopicModalProps}
      title="Создание связи категории и топика"
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
          <Select {...topicCategoriesSelectProps}>
            {topicCategoriesSelectProps?.options?.map((option) => (
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
          <Select {...topicsSelectProps}>
            {topicsSelectProps?.options?.map((option) => (
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
