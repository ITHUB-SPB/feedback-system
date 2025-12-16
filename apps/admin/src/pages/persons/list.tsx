import {
  getDefaultSortOrder,
  List,
  useTable,
  TextField,
} from "@refinedev/antd";

import Table from "antd/es/table";

const ListPersons = () => {
  const { tableProps, sorters } = useTable({
    resource: "auth/admin/list-users",
    pagination: { currentPage: 1, pageSize: 24 },
    sorters: {
      initial: [
        {
          field: "lastName",
          order: "asc",
        },
      ],
    },
    filters: {
      initial: [
        {
          field: "role",
          operator: "eq",
          value: "citizen",
        },
      ],
    },
  });

  return (
    <List title="Респонденты" breadcrumb={null}>
      <Table
        {...tableProps}
        rowKey="id"
        pagination={{
          ...tableProps.pagination,
          hideOnSinglePage: true,
          pageSizeOptions: [12, 24, 48],
        }}
      >
        <Table.Column
          dataIndex="last_name"
          title="Фамилия"
          sorter
          defaultSortOrder={getDefaultSortOrder("lastName", sorters)}
          render={(value: string) => (
            <TextField value={value || "—"} style={{ cursor: "pointer" }} />
          )}
        />

        <Table.Column
          dataIndex="firstName"
          title="Имя"
          sorter
          defaultSortOrder={getDefaultSortOrder("first_name", sorters)}
          render={(value: string) => (
            <TextField value={value || "—"} style={{ cursor: "pointer" }} />
          )}
        />

        <Table.Column
          dataIndex="middleName"
          title="Отчество"
          sorter
          defaultSortOrder={getDefaultSortOrder("middleName", sorters)}
          render={(value: string) => (
            <TextField value={value || "—"} style={{ cursor: "pointer" }} />
          )}
        />

        <Table.Column
          dataIndex="phone"
          title="Телефон"
          sorter
          defaultSortOrder={getDefaultSortOrder("phone", sorters)}
          render={(value: string) => (
            <TextField value={value || "—"} style={{ cursor: "pointer" }} />
          )}
        />

        <Table.Column
          dataIndex="email"
          title="Почта"
          sorter
          defaultSortOrder={getDefaultSortOrder("email", sorters)}
          render={(value: string) => (
            <TextField value={value || "—"} style={{ cursor: "pointer" }} />
          )}
        />
      </Table>
    </List>
  );
};

export default ListPersons;
