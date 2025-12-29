import Table from "antd/es/table";
import Form from "antd/es/form";
import Space from "antd/es/space";
import Input from "antd/es/input";
import Button from "antd/es/button";
import Select from "antd/es/select";

import { getDefaultSortOrder } from "@refinedev/antd";

import { TextField } from "@/components/fields/text";
import { SaveButton } from "@/components/buttons/save";
import { DeleteButton } from "@/components/buttons/delete";
import { EditButton } from "@/components/buttons/edit";

import useOfficialsTable from "../hooks/useOfficialsTable";
import { useAttach } from "../hooks/useAttachOfficial";
import { type UserRecord, type AdministrativeUnitRecord } from "../types";

export default function OfficialsTable() {
  const { table, administrativeUnits } = useOfficialsTable();
  const {
    attachOfficial,
    attachOfficialMutation,
    isAttaching,
    setIsAttaching,
    attachingUnitId,
    setAttachingUnitId,
    attachingOfficialId,
    setAttachingOfficialId,
  } = useAttach();

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
              <TextField value={value || "—"} style={{ cursor: "pointer" }} />
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
              <TextField value={value || "—"} style={{ cursor: "pointer" }} />
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
              <TextField value={value || "—"} style={{ cursor: "pointer" }} />
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
              <TextField value={value || "—"} style={{ cursor: "pointer" }} />
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
              <TextField value={value || "—"} style={{ cursor: "pointer" }} />
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
              <TextField value={value || "—"} style={{ cursor: "pointer" }} />
            );
          }}
        />

        <Table.Column
          title="Поселение"
          sorter
          width={340}
          render={(_, record: UserRecord) => {
            if (administrativeUnits.query.isLoading) {
              return "Загрузка...";
            }

            if (isAttaching && attachingOfficialId === record.id) {
              return (
                <Select
                  {...administrativeUnits.select}
                  style={{ width: "100%" }}
                  onChange={(value) => {
                    setAttachingUnitId(value as unknown as number);
                  }}
                >
                  {administrativeUnits.select?.options?.map((option) => (
                    <Select.Option key={option.id} value={option.id}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              );
            }

            const responsibilityRecord =
              administrativeUnits?.result?.data?.find(
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
  );
}
