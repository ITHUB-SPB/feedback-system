import { Link } from "@tanstack/react-router";

import Table from "antd/es/table";
import Tag from "antd/es/tag";
import Space from "antd/es/space";
import Select from "antd/es/select";
import Typography from "antd/es/typography";
import Skeleton from "antd/es/skeleton";

import {
  getDefaultSortOrder,
  getDefaultFilter,
} from "@/components/table/definition";
import { FilterDropdown } from "@/components/filter-dropdown";
import { ShowButton } from "@/components/buttons";
import ReactionTime from "@/components/tags/reaction-time";
import useFeedbackStatus from "@/hooks/use-feedback-status";
import useFeedbackTable from "@/hooks/use-feedback-table";
import { useAdministrativeUnits } from "@/hooks/use-administrative-units";
import { getStatusColor } from "@/lib/statusColor";

type FeedbackTableProps = {
  role: string;
  table: ReturnType<typeof useFeedbackTable>;
}

export default function FeedbackTable({ role, table }: FeedbackTableProps) {
  const feedbackStatus = useFeedbackStatus();
  const administrativeUnits = useAdministrativeUnits({
    filter: "unit_type_id[eq]2",
  });

  return (
    <Table
      {...table.tableProps}
      dataSource={
        table.tableProps.dataSource ??
        Array.from({ length: table.pageSize }).map((_, index) => ({
          id: index,
        }))
      }
      rowKey="id"
      pagination={{
        ...table?.tableProps.pagination,
        pageSizeOptions: [12, 24, 48],
        hideOnSinglePage: true,
      }}
      sticky
    >
      <Table.Column
        dataIndex="description"
        title="Описание"
        defaultSortOrder={getDefaultSortOrder("description", table?.sorters)}
        render={(value, record) =>
          table.tableProps.loading ? (
            <>
              <Skeleton
                key={"description"}
                title
                active={true}
                paragraph={true}
              />
            </>
          ) : (
            <>
              <Space
                align="baseline"
                styles={{
                  root: { justifyContent: "space-between", width: "100%" },
                }}
              >
                <Typography.Paragraph strong style={{ fontSize: "small" }}>
                  {record.topic
                    ? `${record.feedback_type} (${record.topic})`
                    : record.feedback_type}
                </Typography.Paragraph>
                <Typography.Paragraph style={{ fontSize: "smaller" }}>
                  {new Date(record.created_at).toLocaleString("ru")}
                </Typography.Paragraph>
              </Space>
              <Typography.Paragraph
                ellipsis={{
                  rows: 3,
                  expandable: true,
                  symbol: "Читать полностью",
                }}
              >
                {value}
              </Typography.Paragraph>
            </>
          )
        }
      />

      <Table.Column
        dataIndex="administrative_unit.id"
        title="Общественная территория"
        sorter
        width={240}
        filterDropdown={(props) => (
          <FilterDropdown
            {...props}
            key="administrative_unit_id"
            mapValue={(selectedKey) => {
              if (Array.isArray(selectedKey)) return selectedKey.map(Number);
              return selectedKey && selectedKey !== ""
                ? Number(selectedKey)
                : undefined;
            }}
          >
            <Select
              loading={administrativeUnits.isLoading}
              style={{ width: 175 }}
              {...administrativeUnits.selectProps}
              mode="multiple"
            />
          </FilterDropdown>
        )}
        defaultFilteredValue={getDefaultFilter(
          "administrative_unit.id",
          table?.filters,
          "eq",
        )}
        render={(value, record) => {
          return table.tableProps.loading ? (
            <>
              <Skeleton
                key={"administrative_unit.id-skeleton1"}
                active={true}
                paragraph={false}
              />
              <Skeleton
                key={"administrative_unit.id-skeleton2"}
                active={true}
                paragraph={false}
              />
            </>
          ) : role === "moderator" ? (
            <>
              <Typography.Paragraph strong>
                {record.administrative_unit_title}
              </Typography.Paragraph>
              <Typography.Paragraph>{record.project}</Typography.Paragraph>
            </>
          ) : <Typography.Paragraph>{record.project}</Typography.Paragraph>;
        }}
      />
      <Table.Column
        dataIndex="status.id"
        title="Статус"
        width={150}
        align="center"
        filterResetToDefaultFilteredValue
        filterDropdownProps={{ autoAdjustOverflow: true }}
        render={(_, record) =>
          table.tableProps.loading ? (
            <>
              <Skeleton
                key={"status.id-skeleton"}
                active={true}
                paragraph={false}
              />
            </>
          ) : (
            <Space
              orientation="vertical"
              size="middle"
              style={{ display: "flex", alignItems: "center" }}
            >
              <Tag
                color={getStatusColor(record.status.title)}
                style={{ marginInlineEnd: 0 }}
              >
                {record.status.translation}
              </Tag>
              {record.feedback_status_comment && (
                <Typography.Paragraph style={{ fontSize: 12 }}>
                  {record.feedback_status_comment}
                </Typography.Paragraph>
              )}
            </Space>
          )
        }
        filterDropdown={(props) => (
          <FilterDropdown
            {...props}
            key="status.id"
            mapValue={(selectedKey) => {
              if (Array.isArray(selectedKey)) return selectedKey.map(Number);
              return selectedKey !== "" ? Number(selectedKey) : undefined;
            }}
          >
            <Select
              loading={feedbackStatus.isLoading}
              style={{ width: 175 }}
              {...feedbackStatus.selectProps}
              mode="multiple"
            />
          </FilterDropdown>
        )}
        defaultFilteredValue={getDefaultFilter(
          "feedback_status_id",
          table?.filters,
          "eq",
        )}
      />
      <Table.Column
        dataIndex="created_at"
        title="Сроки ответа"
        width={150}
        align="center"
        sorter
        defaultSortOrder={getDefaultSortOrder("created_at", table?.sorters)}
        render={(value, record) =>
          table.tableProps.loading ? (
            <>
              <Skeleton
                key={"created_at-skeleton"}
                active={true}
                paragraph={false}
              />
            </>
          ) : (
            <ReactionTime value={value} status={record.status.title} />
          )
        }
      />
      <Table.Column
        width={60}
        render={(_, record) => {
          return (
            <Space>
              <Link to="/feedback/$showId" params={{ showId: record.id }}>
                <ShowButton hideText size="small" />
              </Link>
            </Space>
          )
        }}
      />
    </Table>
  );
}
