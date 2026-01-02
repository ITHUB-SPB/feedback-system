import type {
  UseModalFormReturnType,
  UseSelectReturnType,
  useTableReturnType,
} from "@/core/refine-antd";
import type { useMany } from "@/core/refine-core";

export type ITopicCategoryTopic = {
  topic_category_id: number;
  topic_id: number;
};

export type ModalFormProps = {
  topicCategoryTopicModalProps: UseModalFormReturnType<ITopicCategoryTopic>["modalProps"];
  topicCategoryTopicFormProps: UseModalFormReturnType<ITopicCategoryTopic>["formProps"];
  topicCategoriesSelectProps: UseSelectReturnType["selectProps"];
  topicsSelectProps: UseSelectReturnType["selectProps"];
};

export type CategoryTopicsTableProps = {
  table: Pick<useTableReturnType, "tableProps" | "sorters" | "filters">;
  topics: {
    topics: ReturnType<typeof useMany>["result"];
    topicsQuery: ReturnType<typeof useMany>["query"];
    topicsSelectProps: UseSelectReturnType["selectProps"];
  };
  topicCategories: {
    topicCategories: ReturnType<typeof useMany>["result"];
    topicCategoriesQuery: ReturnType<typeof useMany>["query"];
    topicCategoriesSelectProps: UseSelectReturnType["selectProps"];
  };
};
