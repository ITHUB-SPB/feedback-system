import Table from "antd/es/table";
import Form from "antd/es/form";
import Space from "antd/es/space";
import Input from "antd/es/input";
import Button from "antd/es/button";

import {
  getDefaultSortOrder,
} from "@refinedev/antd";

import { useOfficialsTable } from "./_hooks";
import { TextField } from "../../../components/fields/text";
import { SaveButton } from "../../../components/buttons/save";
import { DeleteButton } from "../../../components/buttons/delete";
import { EditButton } from "../../../components/buttons/edit";
import { type UserRecord } from "./_types";

export default function OfficialsTable() {
  const { table, administrativeUnits } = useOfficialsTable()

  return (
    <Form {...table.formProps}>
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
          defaultSortOrder={getDefaultSortOrder("last_name", table.sorters)}
          render={(value: string, record: UserRecord) => {
            return table.isEditing(record.id) ? (
              <Form.Item name="lastName" style={{ margin: 0 }}>
                <Input autoFocus size="small" />
              </Form.Item>
            ) : (
              <TextField
                value={value || "—"}
                style={{ cursor: "pointer" }}
              />
            );
          }}
        />

        <Table.Column
          dataIndex="firstName"
          title="Имя"
          sorter
          defaultSortOrder={getDefaultSortOrder("first_name", table.sorters)}
          render={(value: string, record: UserRecord) => {
            return table.isEditing(record.id) ? (
              <Form.Item name="firstName" style={{ margin: 0 }}>
                <Input autoFocus size="small" />
              </Form.Item>
            ) : (
              <TextField
                value={value || "—"}
                style={{ cursor: "pointer" }}
              />
            );
          }}
        />

        <Table.Column
          dataIndex="middleName"
          title="Отчество"
          sorter
          defaultSortOrder={getDefaultSortOrder("middle_name", table.sorters)}
          render={(value: string, record: UserRecord) => {
            return table.isEditing(record.id) ? (
              <Form.Item name="middleName" style={{ margin: 0 }}>
                <Input autoFocus size="small" />
              </Form.Item>
            ) : (
              <TextField
                value={value || "—"}
                style={{ cursor: "pointer" }}
              />
            );
          }}
        />

        <Table.Column
          dataIndex="phone"
          title="Телефон"
          sorter
          defaultSortOrder={getDefaultSortOrder("phone", table.sorters)}
          render={(value: string, record: UserRecord) => {
            return table.isEditing(record.id) ? (
              <Form.Item name="phone" style={{ margin: 0 }}>
                <Input autoFocus size="small" />
              </Form.Item>
            ) : (
              <TextField
                value={value || "—"}
                style={{ cursor: "pointer" }}
              />
            );
          }}
        />

        <Table.Column
          dataIndex="email"
          title="Почта"
          sorter
          defaultSortOrder={getDefaultSortOrder("email", table.sorters)}
          render={(value: string, record: UserRecord) => {
            return table.isEditing(record.id) ? (
              <Form.Item name="email" style={{ margin: 0 }}>
                <Input autoFocus size="small" />
              </Form.Item>
            ) : (
              <TextField
                value={value || "—"}
                style={{ cursor: "pointer" }}
              />
            );
          }}
        />

        <Table.Column
          dataIndex="social"
          title="Соцсеть"
          render={(value: string, record: UserRecord) => {
            return table.isEditing(record.id) ? (
              <Form.Item name="social" style={{ margin: 0 }}>
                <Input autoFocus size="small" />
              </Form.Item>
            ) : (
              <TextField
                value={value || "—"}
                style={{ cursor: "pointer" }}
              />
            );
          }}
        />

        <Table.Column
          title="Поселение"
          sorter
          defaultSortOrder={getDefaultSortOrder(
            "administrative_unit_id",
            table.sorters,
          )}
          render={(_, record) => {
            if (administrativeUnits.query.isLoading) {
              return "Загрузка...";
            }

            return (
              administrativeUnits?.result?.data?.find(
                (unit) => unit.official_id == record.id,
              )?.administrative_unit ?? "—"
            );
          }}
        />

        <Table.Column
          title="Действия"
          minWidth={120}
          render={(_, record) => {
            if (table.isEditing(record.id)) {
              return (
                <Space>
                  <SaveButton {...table.saveButtonProps} hideText size="small" />
                  <Button {...table.cancelButtonProps} size="small">
                    Отменить
                  </Button>
                </Space>
              );
            }
            return (
              <Space>
                <EditButton
                  {...table.editButtonProps(record.id)}
                  onClick={() => {
                    table.setId(record.id);
                    table.editButtonProps(record.id).onClick();
                  }}
                  resource="auth/admin/get-user"
                  recordItemId={record.id}
                  hideText
                  size="small"
                />
                <DeleteButton
                  hideText
                  size="small"
                  recordItemId={record.id}
                  resource="persons"
                />
              </Space>
            );
          }}
        />
      </Table>
    </Form>

  )
}