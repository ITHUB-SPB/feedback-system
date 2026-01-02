import { getRouteApi } from '@tanstack/react-router'

import {
    getDefaultSortOrder,
    getDefaultFilter,
    FilterDropdown,
} from "@/core/refine-antd";

import Table from "antd/es/table";
import Select from "antd/es/select";
import Space from "antd/es/space";

import { EditButton, ShowButton } from "@/core/refine-antd";
import useProjectsTable from "../hooks/useProjectsTable";

export default function ProjectsTable() {
    const routeApi = getRouteApi('/_authenticated/projects/')
    const { administrativeUnits } = routeApi.useLoaderData()

    const { table, administrativeUnitsSelectProps } = useProjectsTable()

    return (
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
                dataIndex="title"
                title="Название"
                sorter
                defaultSortOrder={getDefaultSortOrder("title", table.sorters)}
            />
            <Table.Column
                dataIndex="administrative_unit_id"
                title="Поселение"
                sorter
                render={(value) => administrativeUnits?.find(({ id }) => id == value)?.title}
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
                            {...administrativeUnitsSelectProps}
                        />
                    </FilterDropdown>
                )}
            />
            <Table.Column
                dataIndex="year_of_completion"
                title="Год реализации"
                sorter
                defaultSortOrder={getDefaultSortOrder("year_of_completion", table.sorters)}
            />
            <Table.Column dataIndex="latitude" title="Широта" />
            <Table.Column dataIndex="longitude" title="Долгота" />
            <Table.Column
                width={90}
                render={(_, record) => (
                    <Space>
                        <ShowButton hideText size="small" />
                        <EditButton hideText size="small" recordItemId={record.id} />
                    </Space>
                )}
            />
        </Table>
    );
}
