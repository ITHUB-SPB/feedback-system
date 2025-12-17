import { CanAccess, useMany, useCan, useGetIdentity } from "@refinedev/core";
import {
  useTable,
  ShowButton,
  getDefaultSortOrder,
  getDefaultFilter,
  FilterDropdown,
  useSelect,
  List,
} from "@refinedev/antd";

import Table from "antd/es/table";
import Tag from "antd/es/tag";
import Space from "antd/es/space";
import Select from "antd/es/select";

const ListFeedback = () => {
  // узнаём роль (через getIdentity из providers/auth-provider.ts либо через user.role из authClient.getSession() )
  const { data: identityData } = useGetIdentity();
  const role = identityData?.role || "citizen"
  const userId = identityData?.id

  // const { result: responsibilities, query: responsibilitiesQuery } = useMany({
  //   resource: "projects",
  //   ids: tableProps?.dataSource?.map((feedback) => feedback.project_id) ?? [],
  // }); 
  // почитать документацию про useMany, заменить resource и ids
  // далее найти в responsibilities такой элемент, у которого свойство official_id будет равно userId

  const { tableProps, sorters, filters } = useTable({
    resource: "feedback",
    pagination: { currentPage: 1, pageSize: 12 },
    sorters: {
      initial: [
        { field: "feedback_status_id", order: "desc" },
        { field: "created_at", order: "asc" },
      ],
    },
    filters: {
      permanent: role === "official" ? [
        {
          field: "feedback_status_id",
          operator: "in",
          value: [1, 2, 4]
        },
        // {
        //   field: "administrative_unit",
        //   operator: "eq",
        //   value: 1 // здесь должно быть название поселения, к которому приписано залогиненное ответственное лицо 
        // }
      ] : []
    }
    // добавить постоянный фильтр на тип предложения (выдавать только "на рассмотрении" и "выполнено")

  });

  const { result: projects, query: projectsQuery } = useMany({
    resource: "projects",
    ids: tableProps?.dataSource?.map((feedback) => feedback.project_id) ?? [],
  });

  const { selectProps: feedbackTypeSelectProps } = useSelect({
    resource: "feedback_types",
    optionLabel: "title",
    optionValue: "id",
    pagination: {
      pageSize: 48,
    },
    defaultValue: getDefaultFilter("feedback_type_id", filters, "eq"),
  });

  const { selectProps: feedbackStatusSelectProps } = useSelect({
    resource: "feedback_statuses",
    optionLabel: "title",
    optionValue: "id",
    pagination: {
      pageSize: 48,
    },
    defaultValue: getDefaultFilter("feedback_status_id", filters, "eq"),
  });

  const { data: accessData } = useCan({
    resource: "feedback",
    action: "show",
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

  return (
    <List title="Предложения граждан">
      <Table
        {...tableProps}
        rowKey="id"
        pagination={{ ...tableProps.pagination, pageSizeOptions: [12, 24, 48] }}
      >
        <Table.Column
          dataIndex="description"
          title="Описание"
          sorter
          defaultSortOrder={getDefaultSortOrder("description", sorters)}
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
            if (projectsQuery.isLoading) {
              return "Загрузка...";
            }

            return projects?.data?.find((project) => project.id == value)
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
              <Select style={{ minWidth: 200 }} {...feedbackTypeSelectProps} />
            </FilterDropdown>
          )}
          defaultFilteredValue={getDefaultFilter(
            "feedback_type_id",
            filters,
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
                {...feedbackStatusSelectProps}
              />
            </FilterDropdown>
          )}
          defaultFilteredValue={getDefaultFilter(
            "feedback_status_id",
            filters,
            "eq",
          )}
        />
        <Table.Column
          dataIndex="created_at"
          title="Дата создания"
          sorter
          defaultSortOrder={getDefaultSortOrder("created_at", sorters)}
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
