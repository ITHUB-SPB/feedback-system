import { createFileRoute } from "@tanstack/react-router";
import OfficialsPage from "@/pages/officials";

import { dataProvider } from '@/providers/data-provider'
import type { OfficialResponsibilityContract, AdministrativeUnitContract } from "@/types";

export const Route = createFileRoute("/_authenticated/officials")({
  loader: async ({ context }) => {
    const { data: officialResponsibilities } = await context.queryClient.ensureQueryData({
      queryKey: ["default", "official_responsibilities", "many"],
      queryFn: () =>
        dataProvider.getList<OfficialResponsibilityContract["all"][0]>({
          resource: "official_responsibilities",
        }),
    });

    const administrativeUnitFilters = [
      {
        field: "administrative_unit_type.title",
        operator: "eq",
        value: "town"
      }
    ]

    const { data: administrativeUnits } = await context.queryClient.ensureQueryData({
      queryKey: ["default", "administrative_units", "many", administrativeUnitFilters],
      queryFn: () =>
        dataProvider.getList<AdministrativeUnitContract["all"][0]>({
          resource: "administrative_units",
          filters: administrativeUnitFilters
        }),
    });

    return { officialResponsibilities, administrativeUnits };
  },
  component: OfficialsPage,
});
