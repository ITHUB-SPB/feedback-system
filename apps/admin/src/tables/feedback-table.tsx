import { Link } from "@tanstack/react-router";

import Table from "antd/es/table";
import Tag from "antd/es/tag";
import Space from "antd/es/space";
import Select from "antd/es/select";
import Typography from "antd/es/typography";

import { getDefaultSortOrder, getDefaultFilter } from "@/components/table/definition";
import { FilterDropdown } from '@/components/filter-dropdown'
import { ShowButton } from "@/components/buttons";
import useFeedbackType from "@/hooks/use-feedback-type";
import useFeedbackStatus from "@/hooks/use-feedback-status";
import useFeedbackTable from "@/hooks/use-feedback-table";
import { getStatusColor } from "@/lib/statusColor";

export default function FeedbackTable() {
  const table = useFeedbackTable();
  const feedbackType = useFeedbackType();
  const feedbackStatus = useFeedbackStatus();

  return (
    <Table
      {...table?.tableProps}
      rowKey="id"
      pagination={{
        ...table?.tableProps.pagination,
        pageSizeOptions: [12, 24, 48],
      }}
      sticky
    >
      <Table.Column
        dataIndex="description"
        title="Описание"
        defaultSortOrder={getDefaultSortOrder("description", table?.sorters)}
        render={(value, record) => (
          <>
            <Typography.Paragraph strong>
              {record.topic
                ? `${record.feedback_type} (${record.topic})`
                : record.feedback_type}
            </Typography.Paragraph>
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
        )}
      />
      <Table.Column
        dataIndex="project"
        title="Проект"
        sorter
        width={220}
        render={(value, record) => {
          return (
            <>
              <Typography.Paragraph strong>
                {record.administrative_unit_title}
              </Typography.Paragraph>
              <Typography.Paragraph>{value}</Typography.Paragraph>
            </>
          );
        }}
      />
      <Table.Column
        dataIndex="feedback_type_id"
        title="Тип"
        sorter
        render={(_, record) => record.feedback_type}
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
              style={{ minWidth: 200 }}
              {...feedbackType.selectProps}
              loading={feedbackType.isLoading}
            />
          </FilterDropdown>
        )}
        defaultFilteredValue={getDefaultFilter(
          "feedback_type_id",
          table?.filters,
          "eq",
        )}
      />
      <Table.Column
        dataIndex="status.id"
        title="Статус"
        filterResetToDefaultFilteredValue
        filterDropdownProps={{ autoAdjustOverflow: true }}
        render={(_, record) => (
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
            <Typography.Paragraph style={{ fontSize: 12 }}>
              {record.feedback_status_comment ?? ""}
            </Typography.Paragraph>
          </Space>
        )}
        filterDropdown={(props) => (
          <FilterDropdown
            {...props}
            key="status.id"
            mapValue={(selectedKey) => {
              if (Array.isArray(selectedKey)) return selectedKey.map(Number);
              return selectedKey && selectedKey !== ""
                ? Number(selectedKey)
                : undefined;
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
        title="Дата создания"
        sorter
        defaultSortOrder={getDefaultSortOrder("created_at", table?.sorters)}
        render={(value) => new Date(value).toLocaleString("ru")}
      />
      <Table.Column
        width={60}
        render={(_, record) => (
          <Space>
            <Link to="/feedback/$showId" params={{ showId: record.id }}>
              <ShowButton hideText size="small" />
            </Link>
          </Space>
        )}
      />
    </Table>
  );
}
