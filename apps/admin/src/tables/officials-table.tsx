import { useNavigate } from "@tanstack/react-router";

import Table from "antd/es/table";
import Form from "antd/es/form";
import Space from "antd/es/space";
import Input from "antd/es/input";
import Button from "antd/es/button";
import Select from "antd/es/select";

import { useInvalidate } from "@refinedev/core";

import { TextField } from "@/components/fields";
import { getDefaultSortOrder } from "@/components/table/definition";
import { SaveButton, DeleteButton, EditButton } from "@/components/buttons";
import { type User } from "@/types";

import { useAdministrativeUnits } from "@/hooks/use-administrative-units";
import { useResponsibilities } from "@/hooks/use-responsibilities";
import useOfficialsTable from "@/hooks/use-officials-table";
import { useOfficialAttach } from "@/hooks/use-official-attach";

export default function OfficialsTable() {
  const administrativeUnits = useAdministrativeUnits({
    filter: "administrative_unit_type.title[eq]town",
  });
  const responsibilities = useResponsibilities();
  const table = useOfficialsTable();

  const {
    attachOfficial,
    attachOfficialMutation,
    isAttaching,
    setIsAttaching,
    attachingUnitId,
    setAttachingUnitId,
    attachingOfficialId,
    setAttachingOfficialId,
  } = useOfficialAttach();

  const navigate = useNavigate();
  const invalidate = useInvalidate();

  return (
    <Form {...table.formProps}>
      <Table
        {...table.tableProps}
        rowKey="id"
        sticky={true}
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
          width={200}
          render={(value: string, record: User) => {
            return table.isEditing(record.id) ? (
              <Form.Item name="lastName" style={{ margin: 0 }}>
                <Input autoFocus size="small" />
              </Form.Item>
            ) : (
              <TextField value={value || "—"} style={{ cursor: "pointer" }} />
            );
          }}
        />

        <Table.Column
          dataIndex="firstName"
          title="Имя"
          width={160}
          sorter
          defaultSortOrder={getDefaultSortOrder("first_name", table.sorters)}
          render={(value: string, record: User) => {
            return table.isEditing(record.id) ? (
              <Form.Item name="firstName" style={{ margin: 0 }}>
                <Input autoFocus size="small" />
              </Form.Item>
            ) : (
              <TextField value={value || "—"} style={{ cursor: "pointer" }} />
            );
          }}
        />

        <Table.Column
          dataIndex="middleName"
          title="Отчество"
          width={180}
          sorter
          defaultSortOrder={getDefaultSortOrder("middle_name", table.sorters)}
          render={(value: string, record: User) => {
            return table.isEditing(record.id) ? (
              <Form.Item name="middleName" style={{ margin: 0 }}>
                <Input autoFocus size="small" />
              </Form.Item>
            ) : (
              <TextField value={value || "—"} style={{ cursor: "pointer" }} />
            );
          }}
        />

        <Table.Column
          dataIndex="phone"
          title="Телефон"
          sorter
          width={180}
          defaultSortOrder={getDefaultSortOrder("phone", table.sorters)}
          render={(value: string, record: User) => {
            return table.isEditing(record.id) ? (
              <Form.Item name="phone" style={{ margin: 0 }}>
                <Input autoFocus size="small" />
              </Form.Item>
            ) : (
              <TextField value={value || "—"} style={{ cursor: "pointer" }} />
            );
          }}
        />

        <Table.Column
          dataIndex="email"
          title="Почта"
          width={180}
          sorter
          defaultSortOrder={getDefaultSortOrder("email", table.sorters)}
          render={(value: string, record: User) => {
            return table.isEditing(record.id) ? (
              <Form.Item name="email" style={{ margin: 0 }}>
                <Input autoFocus size="small" />
              </Form.Item>
            ) : (
              <TextField value={value || "—"} style={{ cursor: "pointer" }} />
            );
          }}
        />

        <Table.Column
          title="Поселение"
          sorter
          width={280}
          render={(_, record: User) => {
            if (isAttaching && attachingOfficialId === record.id) {
              return (
                <Select
                  {...administrativeUnits.selectProps}
                  style={{ width: "100%" }}
                  onChange={(value) => {
                    setAttachingUnitId(value as unknown as number);
                  }}
                >
                  {administrativeUnits.selectProps?.options?.map((option) => (
                    <Select.Option key={option.id} value={option.id}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              );
            }

            const responsibilityRecord = responsibilities?.data?.find(
              (unit) => unit.official_id === record.id,
            )?.administrative_unit;

            if (!responsibilityRecord) {
              return (
                <Button
                  onClick={() => {
                    setIsAttaching(true);
                    setAttachingOfficialId(record.id);
                  }}
                  size="small"
                  type="default"
                  color="geekblue"
                >
                  Назначить
                </Button>
              );
            }

            return responsibilityRecord;
          }}
        />

        <Table.Column
          render={(_, record) => {
            if (isAttaching && attachingOfficialId === record.id) {
              return (
                <Space>
                  <SaveButton
                    {...table.saveButtonProps}
                    hideText
                    disabled={!attachingUnitId}
                    size="small"
                    onClick={() => {
                      attachOfficial({
                        values: {
                          official_id: record.id,
                          administrative_unit_id: attachingUnitId,
                        },
                      });
                      setAttachingUnitId(null);
                      setIsAttaching(false);
                      table.setId(undefined);
                    }}
                  />
                  <Button
                    {...table.cancelButtonProps}
                    size="small"
                    onClick={() => {
                      if (isAttaching) {
                        setAttachingUnitId(null);
                        setIsAttaching(false);
                        table.cancelButtonProps.onClick();
                      }
                    }}
                  >
                    ↩
                  </Button>
                </Space>
              );
            } else if (table.isEditing(record.id)) {
              return (
                <Space>
                  <SaveButton
                    {...table.saveButtonProps}
                    hideText
                    size="small"
                  />
                  <Button {...table.cancelButtonProps} size="small">
                    ↩
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
                  resource="officials"
                  recordItemId={record.id}
                  successNotification={{
                    description: "Успешно",
                    message: "Ответственное лицо удалено",
                    type: "success",
                  }}
                  errorNotification={{
                    description: "Ошибка",
                    message: "Не удалось удалить аккаунт",
                    type: "error",
                  }}
                  onSuccess={() => {
                    invalidate({
                      resource: "officials",
                      invalidates: ["all"],
                    });
                    navigate({ to: "/officials" });
                  }}
                />
              </Space>
            );
          }}
        />
      </Table>
    </Form>
  );
}
