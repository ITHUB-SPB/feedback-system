import { Link } from "@tanstack/react-router";

import Table from "antd/es/table";
import Select from "antd/es/select";
import Space from "antd/es/space";
import Typography from "antd/es/typography";
import Skeleton from "antd/es/skeleton";

import { getDefaultSortOrder } from "@/components/table/definition";

import { FilterDropdown } from "@/components/filter-dropdown";
import { EditButton, ShowButton } from "@/components/buttons";
import useProjectsTable from "@/hooks/use-projects-table";
import { useAdministrativeUnits } from "@/hooks/use-administrative-units";

export default function ProjectsTable() {
  const table = useProjectsTable();
  const administrativeUnits = useAdministrativeUnits();

  return (
    <Table
      {...table.tableProps}
      dataSource={
        table.tableProps.dataSource ??
        Array.from({ length: 12 }).map((_, index) => ({ id: index }))
      }
      rowKey="id"
      pagination={{
        ...table.tableProps.pagination,
        hideOnSinglePage: true,
        pageSizeOptions: [12, 24, 48],
      }}
      sticky
    >
      <Table.Column
        dataIndex="title"
        title="Название"
        sorter
        defaultSortOrder={getDefaultSortOrder("title", table.sorters)}
        render={(value) =>
          table.tableProps.loading ? (
            <Skeleton key={"title"} title active={true} paragraph={false} />
          ) : (
            value
          )
        }
      />
      <Table.Column
        dataIndex="administrative_unit_id"
        title="Поселение"
        width={190}
        sorter
        render={(value) =>
          table.tableProps.loading ? (
            <Skeleton
              key={"administrative_unit_id"}
              title
              active={true}
              paragraph={false}
            />
          ) : (
            administrativeUnits.data?.find(({ id }) => id == value)?.title
          )
        }
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
              {...administrativeUnits.selectProps}
            />
          </FilterDropdown>
        )}
      />
      <Table.Column
        dataIndex="year_of_completion"
        title="Год"
        width={80}
        sorter
        render={(value) =>
          table.tableProps.loading ? (
            <Skeleton
              key={"year_of_completion"}
              title
              active={true}
              paragraph={false}
            />
          ) : (
            value
          )
        }
        defaultSortOrder={getDefaultSortOrder(
          "year_of_completion",
          table.sorters,
        )}
      />
      <Table.Column
        dataIndex="latitude"
        title="Широта"
        width={110}
        render={(value) =>
          table.tableProps.loading ? (
            <Skeleton key={"latitude"} title active={true} paragraph={false} />
          ) : (
            <Typography.Text>{Number(value).toFixed(6)}</Typography.Text>
          )
        }
      />
      <Table.Column
        dataIndex="longitude"
        title="Долгота"
        width={110}
        render={(value) =>
          table.tableProps.loading ? (
            <Skeleton key={"longitude"} title active={true} paragraph={false} />
          ) : (
            <Typography.Text>{Number(value).toFixed(6)}</Typography.Text>
          )
        }
      />
      <Table.Column
        width={90}
        render={(_, record) => (
          <Space>
            <Link to="/projects/$showId" params={{ showId: record.id }}>
              <ShowButton hideText size="small" />
            </Link>
            <Link to="/projects/$editId/edit" params={{ editId: record.id }}>
              <EditButton
                resource="projects"
                hideText
                size="small"
                recordItemId={record.id}
              />
            </Link>
          </Space>
        )}
      />
    </Table>
  );
}
