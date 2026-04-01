import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { PageHeader } from "@/components/page-header";
import CitizensTable from "@/tables/citizens-table";

const queryObject = {
  fetchOptions: {
    credentials: "include",
  },
  query: {
    filterField: "role",
    filterOperator: "eq",
    filterValue: "citizen",
    sortBy: "lastName",
    sortDirection: "asc",
  },
}

export const Route = createFileRoute("/_authenticated/citizens")({
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData({
      queryFn: () => context.authClient.admin.listUsers(queryObject),
      queryKey: ["users", "citizen"],
    });
  },
  component: () => {
    const { context } = Route.parentRoute.useLoaderData()
    const { data, isLoading, isError } = useQuery({
      queryFn: () =>
        context.authClient.admin.listUsers(queryObject),
      queryKey: ["users", "citizen"],
    });

    return (
      <PageHeader title="Респонденты">
        <CitizensTable data={data?.data || []} isLoading={isLoading} />
      </PageHeader>
    );
  },
});
