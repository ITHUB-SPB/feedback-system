import Table from "antd/es/table";
import Space from "antd/es/space";
import Select from "antd/es/select";

import {
  getDefaultSortOrder,
  getDefaultFilter,
  FilterDropdown,
} from "@/core/refine-antd";

import { DeleteButton } from "@/components/buttons";
import useVotingUnits from "@/components/hooks/use-voting-units";
import useVotingVotesTable from "@/components/hooks/use-voting-votes-table";

export default function VotingVotesTable() {
  const table = useVotingVotesTable();
  const votingUnits = useVotingUnits();

  return (
    <Table
      {...table.tableProps}
      rowKey="id"
      pagination={{
        ...table.tableProps.pagination,
        pageSizeOptions: [12, 24, 48],
      }}
    >
      <Table.Column
        dataIndex="username"
        title="Пользователь"
        sorter
        render={(value) => value || "—"}
      />
      <Table.Column
        dataIndex="description"
        title="Описание"
        sorter
        defaultSortOrder={getDefaultSortOrder("description", table.sorters)}
        render={(value) => (
          <div
            style={{
              maxWidth: 300,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {value}
          </div>
        )}
      />
      <Table.Column
        dataIndex="voting_unit_id"
        title="Район"
        sorter
        render={(value) => {
          if (votingUnits.isLoading) {
            return "Загрузка...";
          }

          return votingUnits?.data?.find((unit) => unit.id == value)
            ?.voting_region;
        }}
      />
      <Table.Column
        dataIndex="voting_unit_id"
        title="Поселение"
        sorter
        render={(value) => {
          if (votingUnits.isLoading) {
            return "Загрузка...";
          }

          return votingUnits?.data?.find((unit) => unit.id == value)?.title;
        }}
        filterDropdown={(props) => (
          <FilterDropdown
            {...props}
            mapValue={(selectedKey) => {
              if (Array.isArray(selectedKey)) return undefined;
              return selectedKey && selectedKey !== ""
                ? Number(selectedKey)
                : undefined;
            }}
          >
            <Select
              loading={votingUnits.isLoading}
              style={{ minWidth: 200 }}
              {...votingUnits.selectProps}
            />
          </FilterDropdown>
        )}
        defaultFilteredValue={getDefaultFilter(
          "voting_unit_id",
          table.filters,
          "eq",
        )}
      />
      <Table.Column
        dataIndex="created_at"
        title="Дата создания"
        sorter
        defaultSortOrder={getDefaultSortOrder("created_at", table.sorters)}
        render={(value) => new Date(value).toLocaleString("ru-RU")}
      />
      <Table.Column
        width={120}
        render={(_, record) => (
          <Space>
            <DeleteButton
              resource="voting_votes"
              hideText
              size="small"
              recordItemId={record.id}
            />
          </Space>
        )}
      />
    </Table>
  );
}
