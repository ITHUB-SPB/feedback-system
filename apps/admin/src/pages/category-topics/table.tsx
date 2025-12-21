import {
  getDefaultSortOrder,
  getDefaultFilter,
  FilterDropdown,
} from "@refinedev/antd";

import Table from "antd/es/table";
import Select from "antd/es/select";
import type { CategoryTopicsTableProps } from './types'


export default function CategoryTopicsTable({
  table,
  topics,
  topicCategories,
}: CategoryTopicsTableProps) {
  return (
    <Table
      {...table.tableProps}
      rowKey="id"
      sticky={true}
      pagination={{
        ...table.tableProps.pagination,
        pageSizeOptions: [12, 24, 48],
      }}
    >
      <Table.Column
        dataIndex="topic_category_id"
        title="Категория"
        sorter
        defaultSortOrder={getDefaultSortOrder("topic_category", table.sorters)}
        render={(value) => {
          if (topicCategories.topicCategoriesQuery.isLoading) {
            return "Загрузка...";
          }

          return topicCategories.topicCategories?.data?.find((unit) => unit.id == value)
            ?.title;
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
              {...topicCategories.topicCategoriesSelectProps}
            />
          </FilterDropdown>
        )}
        defaultFilteredValue={getDefaultFilter("topic_category", table.filters)}
      />

      <Table.Column
        dataIndex="topic_id"
        title="Топик"
        sorter
        defaultSortOrder={getDefaultSortOrder("topic", table.sorters)}
        render={(value) => {
          if (topics.topicsQuery.isLoading) {
            return "Загрузка...";
          }

          return topics.topics?.data?.find((unit) => unit.id == value)?.title;
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
            <Select style={{ minWidth: 200 }} {...topics.topicsSelectProps} />
          </FilterDropdown>
        )}
      />
    </Table>

  )
}