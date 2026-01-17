import type { CrudFilter, CrudSort } from "@refinedev/core";

import Table from "antd/es/table";
import Select from "antd/es/select";

import {
  getDefaultSortOrder,
  getDefaultFilter,
} from "@/components/table/definition";

import { FilterDropdown } from "@/components/filter-dropdown";
import { DeleteButton } from "@/components/buttons";
import useTopics from "@/hooks/use-topics";
import useTopicCategories from "@/hooks/use-topic-categories";

import { useTableFromQuery } from "@/components/table/use-table-from-query";
import { useQueryClient } from "@tanstack/react-query";
import { orpcClient } from "@/providers/orpc-client";

export default function TopicCategoryTopicsTable() {
  const queryClient = useQueryClient();

  const topics = useTopics();
  const topicCategories = useTopicCategories();

  const queryOptions = ({
    sorters,
    filters,
  }: {
    sorters?: CrudSort[] | undefined;
    filters?: CrudFilter[] | undefined;
  }) =>
    orpcClient.topicCategoryTopic.all.queryOptions({
      input: {
        sort: sorters,
        filter: filters,
      },
    });

  const table = useTableFromQuery({
    queryOptions,
    sorters: {
      initial: [
        {
          field: "topic_category_id",
          order: "asc",
        },
      ],
    },
  });

  return (
    <Table
      {...table.tableProps}
      rowKey="id"
      sticky={true}
      scroll={{ x: true }}
      size="middle"
    >
      <Table.Column
        dataIndex="topic_category_id"
        title="Категория"
        sorter
        width="48%"
        render={(value) => {
          if (topicCategories.isLoading) {
            return "Загрузка...";
          }

          return topicCategories?.data?.find((unit) => unit.id == value)?.title;
        }}
        filterDropdown={(props) => (
          <FilterDropdown
            {...props}
            mapValue={(selectedKey) => {
              if (Array.isArray(selectedKey)) return undefined;
              return selectedKey && selectedKey !== ""
                ? Number(selectedKey)
                : undefined;
            }}
          >
            <Select
              style={{ minWidth: 200 }}
              {...topicCategories.selectProps}
            />
          </FilterDropdown>
        )}
        defaultFilteredValue={getDefaultFilter("topic_category", table.filters)}
      />

      <Table.Column
        dataIndex="topic_id"
        title="Топик"
        width="48%"
        sorter
        defaultSortOrder={getDefaultSortOrder("topic", table.sorters)}
        render={(value) => {
          if (topics.isLoading) {
            return "Загрузка...";
          }

          return topics.data?.find((unit) => unit.id == value)?.title;
        }}
        filterDropdown={(props) => (
          <FilterDropdown
            {...props}
            mapValue={(selectedKey) => {
              if (Array.isArray(selectedKey)) return undefined;
              return selectedKey && selectedKey !== ""
                ? Number(selectedKey)
                : undefined;
            }}
          >
            <Select style={{ minWidth: 200 }} {...topics.selectProps} />
          </FilterDropdown>
        )}
      />
      <Table.Column
        render={(_, record) => (
          <DeleteButton
            hideText
            size="small"
            recordItemId={record.id}
            resource="topic_category_topics"
            successNotification={{
              message: "Пара удалена",
              description: "Успешно",
              type: "success",
            }}
            errorNotification={{
              message: "Не удалось удалить пару",
              description: "Ошибка",
              type: "error",
            }}
            onSuccess={() => {
              queryClient.invalidateQueries({
                queryKey: [["topicCategoryTopic", "all"]],
                refetchType: "all",
              });
            }}
          />
        )}
      />
    </Table>
  );
}
