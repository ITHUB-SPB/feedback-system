import { createFileRoute } from "@tanstack/react-router";

import Space from "antd/es/space";
import Button from "antd/es/button";

import { PageHeader } from "@/components/page-header";
import VotingUnitsTable from "@/tables/voting-units-table";
import VotingUnitCreateForm from "@/forms/voting-unit-create-form";

import useVotingUnitCreate from "@/hooks/use-voting-unit-create";

export const Route = createFileRoute("/_authenticated/voting_units")({
  component: ListVotingUnits,
});

function ListVotingUnits() {
  const votingUnitCreate = useVotingUnitCreate();

  return (
    <>
      <PageHeader
        title="Участники голосования"
        extra={
          <Space>
            <Button
              onClick={() => {
                votingUnitCreate.show();
              }}
              type="primary"
            >
              Добавить поселение
            </Button>
          </Space>
        }
      >
        <VotingUnitsTable />
      </PageHeader>

      <VotingUnitCreateForm
        modalProps={votingUnitCreate.modalProps}
        formProps={votingUnitCreate.formProps}
      />
    </>
  );
}
