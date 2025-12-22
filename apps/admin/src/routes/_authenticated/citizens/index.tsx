import { createFileRoute } from '@tanstack/react-router'
import {
  getDefaultSortOrder,
  useTable,
} from "@refinedev/antd";
import Table from "antd/es/table";

import { TextField } from "../../../components/fields/text";
import { List } from "../../../components/crud/list";

export const Route = createFileRoute('/_authenticated/citizens/')({
  component: ListCitizens,
})

export default function ListCitizens() {
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
    <List title="Респонденты">
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
          dataIndex="lastName"
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
