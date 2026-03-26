import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/page-header";
import AdministrativeUnitsTable from "@/tables/administrative-units-table";

export const Route = createFileRoute("/_authenticated/administrative_units")({
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData(
      context.orpcClient.administrativeUnit.all.queryOptions({
        input: {
          filter: "administrative_unit_type.title[eq]town",
        },
      }),
    );

    context.queryClient.ensureQueryData(
      context.orpcClient.administrativeUnitType.all.queryOptions({
        input: {},
      }),
    );
  },
  component: () => (
    <PageHeader title="Поселения">
      <AdministrativeUnitsTable />
    </PageHeader>
  ),
});
