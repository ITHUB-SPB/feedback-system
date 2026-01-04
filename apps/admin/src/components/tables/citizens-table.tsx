import Table from "antd/es/table";

import { TextField, getDefaultSortOrder } from "@/core/refine-antd";

import useCitizensTable from "../hooks/use-citizens-table";

export default function CitizensTable() {
  const table = useCitizensTable();

  return (
    <Table
      {...table.tableProps}
      rowKey="id"
      pagination={{
        ...table.tableProps.pagination,
        hideOnSinglePage: true,
        pageSizeOptions: [12, 24, 48],
      }}
    >
      <Table.Column
        dataIndex="lastName"
        title="Фамилия"
        sorter
        defaultSortOrder={getDefaultSortOrder("lastName", table.sorters)}
        render={(value: string) => (
          <TextField value={value || "—"} style={{ cursor: "pointer" }} />
        )}
      />

      <Table.Column
        dataIndex="firstName"
        title="Имя"
        sorter
        defaultSortOrder={getDefaultSortOrder("first_name", table.sorters)}
        render={(value: string) => (
          <TextField value={value || "—"} style={{ cursor: "pointer" }} />
        )}
      />

      <Table.Column
        dataIndex="middleName"
        title="Отчество"
        sorter
        defaultSortOrder={getDefaultSortOrder("middleName", table.sorters)}
        render={(value: string) => (
          <TextField value={value || "—"} style={{ cursor: "pointer" }} />
        )}
      />

      <Table.Column
        dataIndex="phone"
        title="Телефон"
        sorter
        defaultSortOrder={getDefaultSortOrder("phone", table.sorters)}
        render={(value: string) => (
          <TextField value={value || "—"} style={{ cursor: "pointer" }} />
        )}
      />

      <Table.Column
        dataIndex="email"
        title="Почта"
        sorter
        defaultSortOrder={getDefaultSortOrder("email", table.sorters)}
        render={(value: string) => (
          <TextField value={value || "—"} style={{ cursor: "pointer" }} />
        )}
      />
    </Table>
  );
}
