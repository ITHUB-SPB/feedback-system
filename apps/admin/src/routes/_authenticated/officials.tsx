import { createFileRoute } from "@tanstack/react-router";
import Space from "antd/es/space";
import Button from "antd/es/button";

import { List } from "@/components/layouts";
import useOfficialCreate from "@/components/hooks/official-create";
import OfficialCreateModalForm from "@/components/forms/official-create";
import OfficialsTable from "@/components/tables/officials-table";

export const Route = createFileRoute("/_authenticated/officials")({
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData(
      context.orpcClient.officialResponsibility.all.queryOptions({
        input: {}
      })
    );

    context.orpcClient.administrativeUnit.all.queryOptions({
      input: {
        filter: "administrative_unit_type.title[eq]town"
      }
    })
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
      <List
        title="Администрация"
        resource="officials"
        headerButtons={
          <Space>
            <Button
              onClick={() => {
                createOfficialModalShow();
              }}
              type="primary"
            >
              Создать
            </Button>
          </Space>
        }
      >
        <OfficialsTable />
      </List>
      <OfficialCreateModalForm
        officialCreateFormProps={createOfficialFormProps}
        officialCreateModalProps={createOfficialModalProps}
      />
    </>
  );
}
