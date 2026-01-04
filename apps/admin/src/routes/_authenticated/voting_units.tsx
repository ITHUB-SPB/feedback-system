import { createFileRoute } from "@tanstack/react-router";

import Space from "antd/es/space";
import Button from "antd/es/button";

import { PageHeader } from "@/components/pageHeader";
import VotingUnitsTable from "@/components/tables/voting-units-table";
import VotingUnitCreateForm from "@/components/forms/voting-unit-create-form";
import VotingRegionCreateForm from "@/components/forms/voting-region-create-form";

import useVotingRegionCreate from "@/components/hooks/use-voting-region-create";
import useVotingUnitCreate from "@/components/hooks/use-voting-unit-create";

export const Route = createFileRoute("/_authenticated/voting_units")({
  component: ListVotingUnits,
});

function ListVotingUnits() {
  const votingRegionCreate = useVotingRegionCreate();
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
            <Button
              onClick={() => {
                votingRegionCreate.show();
              }}
              type="default"
            >
              Добавить район
            </Button>
          </Space>
        }
      >
        <VotingUnitsTable />
      </PageHeader>

      <VotingRegionCreateForm
        modalProps={votingRegionCreate.modalProps}
        formProps={votingRegionCreate.formProps}
      />
      <VotingUnitCreateForm
        modalProps={votingUnitCreate.modalProps}
        formProps={votingUnitCreate.formProps}
      />
    </>
  );
}
