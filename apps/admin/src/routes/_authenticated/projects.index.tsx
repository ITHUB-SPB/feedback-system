import { createFileRoute, Link } from "@tanstack/react-router";

import { CreateButton } from "@/components/buttons/create";
import { PageHeader } from "@/components/page-header";
import ProjectsTable from "@/tables/projects-table";

export const Route = createFileRoute("/_authenticated/projects/")({
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData(
      context.orpcClient.administrativeUnit.all.queryOptions({
        input: {},
      }),
    );
  },
  component: ListProjects,
});

function ListProjects() {
  return (
    <PageHeader
      title="Реализованные проекты"
      extra={
        <Link to="/projects/create">
          <CreateButton resource="projects" iconPlacement="end" size="middle">
            Добавить
          </CreateButton>
        </Link>
      }
    >
      <ProjectsTable />
    </PageHeader>
  );
}
