import { createFileRoute } from "@tanstack/react-router";

import { ExportButton } from "@/components/buttons";
import { PageHeader } from "@/components/page-header";
import VotingVotesTable from "@/tables/voting-votes-table";
import useVotingVotesExport from "@/hooks/use-voting-votes-export";

export const Route = createFileRoute("/_authenticated/voting_votes")({
  component: ListVotingVotes,
});

function ListVotingVotes() {
  const votingVotesExport = useVotingVotesExport();

  return (
    <PageHeader
      title="Голоса"
      extra={
        <ExportButton
          onClick={votingVotesExport.triggerExport}
          loading={votingVotesExport.isLoading}
          hideText={true}
        />
      }
    >
      <VotingVotesTable />
    </PageHeader>
  );
}
