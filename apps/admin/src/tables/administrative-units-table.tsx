
import Table from "antd/es/table";
import Space from "antd/es/space";
import Select from "antd/es/select";
import Form from "antd/es/form";
import Button from "antd/es/button";
import Input from "antd/es/input";

import { TextField } from '@/components/fields'
import { getDefaultSortOrder } from "@/components/table/definition";
import { EditButton, DeleteButton, SaveButton } from "@/components/buttons";
import useAdministrativeUnitsTable from "@/hooks/use-administrative-units-table";
import useAdministrativeUnitTypes from "@/hooks/use-administrative-unit-types";
import type { AdministrativeUnitContract } from "@/types";

const translateUnitType = (value: string) => {
  return {
    settlement: "Поселение",
    town: "Город",
  }[value];
};

export default function AdministrativeUnitsTable() {
  const unitTypes = useAdministrativeUnitTypes();
  const table = useAdministrativeUnitsTable();

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
        size="small"
      >
        <Table.Column
          dataIndex="title"
          title="Название"
          sorter
          defaultSortOrder={getDefaultSortOrder("title", table.sorters)}
          render={(
            value: string,
            record: AdministrativeUnitContract["all"][0],
          ) => {
            return table.isEditing(record.id) ? (
              <Form.Item name="title" style={{ margin: 0 }}>
                <Input size="small" />
              </Form.Item>
            ) : (
              <TextField value={value || "—"} style={{ cursor: "pointer" }} />
            );
          }}
        />

        <Table.Column
          dataIndex="unit_type_id"
          title="Тип"
          width={160}
          sorter
          defaultSortOrder={getDefaultSortOrder("unit_type", table.sorters)}
          render={(
            value: string,
            record: AdministrativeUnitContract["all"][0],
          ) => {
            if (table.isEditing(record.id)) {
              return (
                <Form.Item name="unit_type_id" style={{ margin: 0 }}>
                  <Select
                    loading={unitTypes.isLoading}
                    options={unitTypes.data?.map((unitType) => ({
                      label: translateUnitType(unitType.title),
                      value: unitType.id,
                    }))}
                  />
                </Form.Item>
              );
            }

            if (unitTypes.isLoading) {
              return "Загрузка...";
            }

            const unitType = unitTypes.data?.find(
              (unitType) => unitType.id == value,
            )?.title;

            return (
              <TextField
                value={unitType ? translateUnitType(unitType) : ""}
                style={{ cursor: "pointer" }}
              />
            );
          }}
        />
        <Table.Column
          width={80}
          render={(_, record) => {
            if (table.isEditing(record.id)) {
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
                  resource="administrative_units"
                  recordItemId={record.id}
                  {...table.editButtonProps(record.id)}
                  onClick={() => {
                    table.setId(record.id);
                    table.editButtonProps(record.id).onClick();
                  }}
                  hideText
                  size="small"
                />
                <DeleteButton
                  hideText
                  size="small"
                  recordItemId={record.id}
                  resource="administrative_units"
                  successNotification={{
                    message: "Успешно",
                    description: "Поселение удалено",
                    type: "success",
                  }}
                  errorNotification={{
                    message: "Ошибка",
                    description: "Не удалось удалить поселение",
                    type: "error",
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
