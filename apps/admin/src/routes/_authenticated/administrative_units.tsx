import { createFileRoute } from "@tanstack/react-router";

import Button from "antd/es/button";

import { PageHeader } from "@/components/page-header";
import AdministrativeUnitsTable from "@/tables/administrative-units-table";
import OfficialAssignModalForm from "@/forms/official-assign-form";
import useOfficialAssignForm from "@/hooks/use-official-assign-form";

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
  component: ListAdministrativeUnits,
});

function ListAdministrativeUnits() {
  const {
    officialAssignModalProps,
    officialAssignFormProps,
    officialAssignModalShow,
  } = useOfficialAssignForm();

  return (
    <>
      <PageHeader
        title="Поселения"
        extra={
          <Button onClick={() => officialAssignModalShow()} color="geekblue">
            Назначить ответственного
          </Button>
        }
      >
        <AdministrativeUnitsTable />
      </PageHeader>

      <OfficialAssignModalForm
        officialAssignModalProps={officialAssignModalProps}
        officialAssignFormProps={officialAssignFormProps}
      />
    </>
  );
}
