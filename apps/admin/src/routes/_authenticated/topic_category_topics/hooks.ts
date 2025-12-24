import { useMany } from "@refinedev/core";

import { useTable, useSelect, useModalForm } from "@refinedev/antd";

import type { ITopicCategoryTopic } from "./types";

export function useTopicCategoryTopic() {
  const { tableProps, sorters, filters } = useTable({
    pagination: { currentPage: 1, pageSize: 12 },
    sorters: {
      initial: [{ field: "topic_category_id", order: "asc" }],
    },
    filters: {
      initial: [],
    },
  });

  const { result: topics, query: topicsQuery } = useMany({
    resource: "topics",
    ids: tableProps?.dataSource?.map((tct) => tct.topic_id) ?? [],
  });

  const { result: topicCategories, query: topicCategoriesQuery } = useMany({
    resource: "topic_categories",
    ids: tableProps?.dataSource?.map((tct) => tct.topic_category_id) ?? [],
  });

  const { selectProps: topicsSelectProps } = useSelect({
    resource: "topics",
    pagination: {
      pageSize: 48,
    },
  });

  const { selectProps: topicCategoriesSelectProps } = useSelect({
    resource: "topic_categories",
    pagination: {
      pageSize: 48,
    },
  });

  const {
    modalProps: topicCategoryTopicModalProps,
    formProps: topicCategoryTopicFormProps,
    show: createTopicCategoryTopicModalShow,
  } = useModalForm<ITopicCategoryTopic>({
    action: "create",
    resource: "topic_category_topics",
    redirect: false,
  });

  return {
    table: {
      tableProps,
      sorters,
      filters,
    },
    topics: {
      topics,
      topicsQuery,
      topicsSelectProps,
    },
    topicCategories: {
      topicCategories,
      topicCategoriesQuery,
      topicCategoriesSelectProps,
    },
    modal: {
      topicCategoryTopicModalProps,
      topicCategoryTopicFormProps,
      createTopicCategoryTopicModalShow,
    },
  };
}
