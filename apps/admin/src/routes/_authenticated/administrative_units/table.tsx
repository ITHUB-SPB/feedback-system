import { getDefaultSortOrder } from "@refinedev/antd";

import Table from "antd/es/table";
import Space from "antd/es/space";
import Select from "antd/es/select";
import Form from "antd/es/form";
import Button from "antd/es/button";
import Input from "antd/es/input";

import { TextField } from "../../../components/fields/text";
import { EditButton } from "../../../components/buttons/edit";
import { DeleteButton } from "../../../components/buttons/delete";
import { SaveButton } from "../../../components/buttons/save";

import type { PersonRecord, AdministrativeUnitRecord } from "./types";
import { useAttach, useAdministrativeUnitsTable, useOfficials } from "./hooks";

const translateUnitType = (value: string) => {
  return {
    settlement: "Поселение",
    town: "Город",
  }[value];
};

export default function AdministrativeUnitsTable() {
  const {
    attachOfficial,
    isAttaching,
    setIsAttaching,
    attachingUnitId,
    setAttachingUnitId,
    attachingOfficialId,
    setAttachingOfficialId,
  } = useAttach();

  const { table, responsibilities, unitTypes } = useAdministrativeUnitsTable();

  const { officialsSelectProps } = useOfficials();

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
          dataIndex="title"
          title="Название"
          sorter
          defaultSortOrder={getDefaultSortOrder("title", table.sorters)}
          render={(value: string, record: AdministrativeUnitRecord) => {
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
          render={(value: string, record: AdministrativeUnitRecord) => {
            if (table.isEditing(record.id)) {
              return (
                <Form.Item name="unit_type_id" style={{ margin: 0 }}>
                  <Select
                    options={unitTypes?.unitTypes?.data.map((unitType) => ({
                      label: translateUnitType(unitType.title),
                      value: unitType.id,
                    }))}
                  />
                </Form.Item>
              );
            }

            if (unitTypes.unitTypesQuery.isLoading) {
              return "Загрузка...";
            }

            const unitType = unitTypes.unitTypes?.data?.find(
              (unitType) => unitType.id == value,
            )?.title;

            return (
              <TextField
                value={translateUnitType(unitType)}
                style={{ cursor: "pointer" }}
              />
            );
          }}
        />
        <Table.Column
          title="Ответственный"
          width={340}
          sorter
          render={(_, record: PersonRecord) => {
            if (responsibilities.responsibilitiesQuery.isLoading) {
              return "Загрузка...";
            }

            if (isAttaching && attachingUnitId === record.id) {
              return (
                <Select
                  {...officialsSelectProps}
                  style={{ width: "100%" }}
                  onChange={(value) => {
                    setAttachingOfficialId(value as unknown as string);
                  }}
                >
                  {officialsSelectProps?.options?.map((option) => (
                    <Select.Option key={option.id} value={option.id}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              );
            }

            const responsibilityRecord =
              responsibilities.responsibilities?.data?.find(
                (responsibility) =>
                  responsibility.administrative_unit_id == record.id,
              );

            if (!responsibilityRecord) {
              return (
                <Button
                  onClick={() => {
                    setIsAttaching(true);
                    setAttachingUnitId(record.id);
                  }}
                  size="small"
                  type="default"
                  color="geekblue"
                >
                  Назначить
                </Button>
              );
            }

            const { officialFirstName, officialLastName, officialMiddleName } =
              responsibilityRecord;

            return `${officialLastName} ${officialFirstName} ${officialMiddleName}`;
          }}
        />
        <Table.Column
          width={120}
          render={(_, record) => {
            if (isAttaching && attachingUnitId === record.id) {
              return (
                <Space>
                  <SaveButton
                    {...table.saveButtonProps}
                    hideText
                    disabled={!attachingOfficialId}
                    size="small"
                    onClick={() => {
                      attachOfficial({
                        values: {
                          official_id: attachingOfficialId,
                          administrative_unit_id: record.id,
                        },
                      });
                      setAttachingOfficialId(null);
                      setIsAttaching(false);
                      table.setId(undefined);
                    }}
                  />
                  <Button
                    {...table.cancelButtonProps}
                    size="small"
                    onClick={() => {
                      if (isAttaching) {
                        setAttachingOfficialId(null);
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
                  hideText
                  size="small"
                />
                <DeleteButton
                  hideText
                  size="small"
                  recordItemId={record.id}
                  resource="administrative_units"
                />
              </Space>
            );
          }}
        />
      </Table>
    </Form>
  );
}
