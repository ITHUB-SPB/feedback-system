import Table from "antd/es/table";
import { useQuery } from "@tanstack/react-query";
import type { CrudFilter, CrudSort } from "@refinedev/core";

import { TextField } from "@/components/fields";
import { authClient } from "@/providers/auth-client";

export default async function CitizensTable() {
  const { data, isLoading, isError } = useQuery({
    queryFn: () =>
      authClient.admin.listUsers({
        fetchOptions: {
          credentials: "include",
        },
        query: {
          filterField: "role",
          filterOperator: "eq",
          filterValue: "citizen",
          sortBy: "lastName",
          sortDirection: "asc",
        },
      }),
    queryKey: ["users", "citizen"],
  });

  return (
    <Table
      dataSource={data?.data?.users || []}
      loading={isLoading}
      // loading: queryResult.query?.isLoading,
      rowKey="id"
      sticky
      pagination={false}
    >
      <Table.Column
        dataIndex="lastName"
        title="Фамилия"
        sorter
        render={(value: string) => (
          <TextField value={value || "—"} style={{ cursor: "pointer" }} />
        )}
      />

      <Table.Column
        dataIndex="firstName"
        title="Имя"
        sorter
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

      <Table.Column
        dataIndex="phone"
        title="Телефон"
        render={(value: string) => (
          <TextField value={value || "—"} style={{ cursor: "pointer" }} />
        )}
      />

      <Table.Column
        dataIndex="email"
        title="Почта"
        sorter
        render={(value: string) => (
          <TextField value={value || "—"} style={{ cursor: "pointer" }} />
        )}
      />
    </Table>
  );
}
