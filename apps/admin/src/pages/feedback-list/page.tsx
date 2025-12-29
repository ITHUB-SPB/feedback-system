import {
    getDefaultSortOrder,
    getDefaultFilter,
    FilterDropdown,
} from "@refinedev/antd";

import Table from "antd/es/table";
import Tag from "antd/es/tag";
import Space from "antd/es/space";
import Select from "antd/es/select";
import Typography from "antd/es/typography";

import { ShowButton } from "../../components/buttons/show";
import { List } from "../../components/crud/list";

import { getStatusColor } from "./lib/statusColor";
import useFeedbackTable from "./hooks/useFeedbackTable";
import type { FeedbackListPageProps } from "./types";

export default function FeedbackListPage({ user }: FeedbackListPageProps) {
    const { table, projects, select } = useFeedbackTable(user?.id, user?.role);

    return (
        <List title="Предложения граждан">
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
                    dataIndex="project_id"
                    title="Проект"
                    sorter
                    width={220}
                    render={(value, record) => {
                        if (projects?.projectsQuery.isLoading) {
                            return "Загрузка...";
                        }

                        return (
                            <>
                                <Typography.Paragraph strong>
                                    {record.administrative_unit_title}
                                </Typography.Paragraph>
                                <Typography.Paragraph>
                                    {
                                        projects?.projects?.data?.find(
                                            (project) => project.id == value,
                                        )?.title
                                    }
                                </Typography.Paragraph>
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
                                {...select?.feedbackTypeSelectProps}
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
                        <Space orientation="vertical" size="middle" style={{ display: 'flex', alignItems: "center" }}>
                            <Tag color={getStatusColor(record.status.title)} style={{ marginInlineEnd: 0 }}>
                                {record.status.translation}
                            </Tag>
                            <Typography.Paragraph style={{ fontSize: 12 }}>{record.feedback_status_comment ?? ""}</Typography.Paragraph>
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
                                style={{ width: 175 }}
                                {...select?.feedbackStatusSelectProps}
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
                    width={120}
                    render={(_, record) => (
                        <Space>
                            <ShowButton hideText size="small" recordItemId={record.id} />
                        </Space>
                    )}
                />
            </Table>
        </List>

    )
}