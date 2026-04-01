import Table from "antd/es/table";

import { TextField } from "@/components/fields";
import type { UsersList, User } from "@/types";

export default function CitizensTable({ data, isLoading }: {
  data: UsersList<User>["data"],
  isLoading: boolean
}) {
  return (
    <Table
      dataSource={data?.users || []}
      loading={isLoading}
      rowKey="id"
      sticky
      pagination={false}
    >
      <Table.ColumnGroup
        title="ФИО"
        sorter={(a, b) => a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName)}
      >
        <Table.Column
          dataIndex="lastName"
          title="Фамилия"
          render={(value: string) => (
            <TextField value={value || "—"} style={{ cursor: "pointer" }} />
          )}
        />

        <Table.Column
          dataIndex="firstName"
          title="Имя"
          render={(value: string) => (
            <TextField value={value || "—"} style={{ cursor: "pointer" }} />
          )}
        />

        <Table.Column
          dataIndex="middleName"
          title="Отчество"
          render={(value: string) => (
            <TextField value={value || "—"} style={{ cursor: "pointer" }} />
          )}
        />
      </Table.ColumnGroup>

      <Table.ColumnGroup title="Контакты">
        <Table.Column
          dataIndex="phone"
          title="Телефон"
          sorter={(a, b) => a.phone.localeCompare(b.phone)}
          render={(value: string) => (
            <TextField value={value || "—"} style={{ cursor: "pointer" }} />
          )}
        />

        <Table.Column
          dataIndex="email"
          title="Почта"
          sorter={(a, b) => a.email.localeCompare(b.email)}
          render={(value: string) => (
            <TextField value={value || "—"} style={{ cursor: "pointer" }} />
          )}
        />
      </Table.ColumnGroup>
    </Table>
  );
}
