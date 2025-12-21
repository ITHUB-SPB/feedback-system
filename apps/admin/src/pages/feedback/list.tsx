import { useCan } from "@refinedev/core";

import {
  getDefaultSortOrder,
  getDefaultFilter,
  FilterDropdown,
} from "@refinedev/antd";

import Table from "antd/es/table";
import Tag from "antd/es/tag";
import Space from "antd/es/space";
import Select from "antd/es/select";

import { ShowButton } from "../../components/buttons/show";
import { List } from "../../components/crud/list";

import { useFeedbackTable } from './hooks'


const ListFeedback = () => {
  const { data: accessData } = useCan({
    resource: "feedback",
    action: "show",
    queryOptions: {
      // staleTime: 1000 * 60
    },
  });

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: "orange",
      approved: "blue",
      completed: "green",
      declined: "red",
    };
    return colorMap[status] || "default";
  };

  const getStatusText = (status: string) => {
    return {
      pending: "На проверке",
      approved: "В работе",
      completed: "Выполнено",
      declined: "Отклонено",
    }[status];
  };

  const { table, projects, select } = useFeedbackTable()

  return (
    <List title="Предложения граждан">
      <Table
        {...table.tableProps}
        rowKey="id"
        pagination={{ ...table.tableProps.pagination, pageSizeOptions: [12, 24, 48] }}
      >
        <Table.Column
          dataIndex="description"
          title="Описание"
          sorter
          defaultSortOrder={getDefaultSortOrder("description", table.sorters)}
          render={(value) => (
            <div
              style={{
                maxWidth: 300,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {value}
            </div>
          )}
        />
        <Table.Column
          dataIndex="project_id"
          title="Проект"
          sorter
          render={(value) => {
            if (projects.projectsQuery.isLoading) {
              return "Загрузка...";
            }

            return projects.projects?.data?.find((project) => project.id == value)
              ?.title;
          }}
        />
        <Table.Column
          dataIndex="feedback_type_id"
          title="Тип обращения"
          sorter
          render={(_, record) => record.feedback_type}
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
              <Select style={{ minWidth: 200 }} {...select.feedbackTypeSelectProps} />
            </FilterDropdown>
          )}
          defaultFilteredValue={getDefaultFilter(
            "feedback_type_id",
            table.filters,
            "eq",
          )}
        />
        <Table.Column
          dataIndex="topic"
          title="Тема"
          sorter
          render={(value) => value || "—"}
        />
        <Table.Column
          dataIndex="feedback_status_id"
          title="Статус"
          sorter
          render={(_, record) => (
            <Tag color={getStatusColor(record.feedback_status)}>
              {getStatusText(record.feedback_status)}
            </Tag>
          )}
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
                {...select.feedbackStatusSelectProps}
              />
            </FilterDropdown>
          )}
          defaultFilteredValue={getDefaultFilter(
            "feedback_status_id",
            table.filters,
            "eq",
          )}
        />
        <Table.Column
          dataIndex="created_at"
          title="Дата создания"
          sorter
          defaultSortOrder={getDefaultSortOrder("created_at", table.sorters)}
          render={(value) => new Date(value).toLocaleDateString("ru-RU")}
        />

        {accessData?.can && (
          <Table.Column
            title="Действия"
            minWidth={120}
            render={(_, record) => (
              <Space>
                <ShowButton hideText size="small" recordItemId={record.id} />
              </Space>
            )}
          />
        )}
      </Table>
    </List>
  );
};

export default ListFeedback;
