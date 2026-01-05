import Table from "antd/es/table";
import Form from "antd/es/form";
import Space from "antd/es/space";
import Input from "antd/es/input";
import Select from "antd/es/select";
import Button from "antd/es/button";

import { TextField } from "@/components/fields";
import { getDefaultSortOrder } from "@/components/table/definition";
import { EditButton, SaveButton, DeleteButton } from "@/components/buttons";
import useVotingUnitsTable from "@/hooks/use-voting-units-table";
import useVotingRegions from "@/hooks/use-voting-regions";
import type { VotingUnitContract } from "@/types";

type VotingUnitRecord = VotingUnitContract["all"][0];

export default function VotingUnitsTable() {
  const table = useVotingUnitsTable();
  const votingRegions = useVotingRegions();

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
          dataIndex="voting_region_id"
          title="Район"
          width="47%"
          sorter
          defaultSortOrder={getDefaultSortOrder("voting_region", table.sorters)}
          render={(value: string, record: VotingUnitRecord) => {
            return table.isEditing(record.id) ? (
              <Form.Item name="voting_region_id" style={{ margin: 0 }}>
                <Select {...votingRegions.selectProps}>
                  {votingRegions.selectProps?.options?.map((option) => (
                    <Select.Option key={option.id} value={option.id}>
                      {option.title}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            ) : votingRegions.isLoading ? (
              <TextField
                value={record.voting_region}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <TextField
                value={
                  votingRegions?.data?.find((unit) => unit.id == value)?.title
                }
                style={{ cursor: "pointer" }}
              />
            );
          }}
        />

        <Table.Column
          dataIndex="title"
          title="Поселение"
          width="47%"
          sorter
          defaultSortOrder={getDefaultSortOrder("title", table.sorters)}
          render={(value: string, record: VotingUnitRecord) => {
            return table.isEditing(record.id) ? (
              <Form.Item name="title" style={{ margin: 0 }}>
                <Input autoFocus size="small" defaultValue={value} />
              </Form.Item>
            ) : (
              <TextField value={value || "—"} style={{ cursor: "pointer" }} />
            );
          }}
        />

        <Table.Column
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
                    Отменить
                  </Button>
                </Space>
              );
            }
            return (
              <Space>
                <EditButton
                  resource="voting_units"
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
                  resource="voting_units"
                  successNotification={{
                    type: "success",
                    description: "Успешно",
                    message: "Участник удален"
                  }}
                  errorNotification={{
                    type: "error",
                    description: "Ошибка",
                    message: "Не удалось удалить участника"
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
