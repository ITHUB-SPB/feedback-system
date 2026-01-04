import { createFileRoute } from "@tanstack/react-router";
import Button from "antd/es/button";

import { PageHeader } from "@/components/pageHeader";
import useOfficialCreate from "@/components/hooks/use-official-create";
import OfficialCreateModalForm from "@/components/forms/official-create-form";
import OfficialsTable from "@/components/tables/officials-table";

export const Route = createFileRoute("/_authenticated/officials")({
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData(
      context.orpcClient.officialResponsibility.all.queryOptions({
        input: {},
      }),
    );

    context.orpcClient.administrativeUnit.all.queryOptions({
      input: {
        filter: "administrative_unit_type.title[eq]town",
      },
    });
  },
  component: OfficialsPage,
});

function OfficialsPage() {
  const {
    createOfficialFormProps,
    createOfficialModalProps,
    createOfficialModalShow,
  } = useOfficialCreate();

  return (
    <>
      <PageHeader
        title="Администрация"
        extra={
          <Button
            onClick={() => {
              createOfficialModalShow();
            }}
            type="primary"
          >
            Создать
          </Button>
        }
      >
        <OfficialsTable />
      </PageHeader>
      <OfficialCreateModalForm
        officialCreateFormProps={createOfficialFormProps}
        officialCreateModalProps={createOfficialModalProps}
      />
    </>
  );
}
