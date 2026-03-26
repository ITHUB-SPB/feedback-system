import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/page-header";
import CitizensTable from "@/tables/citizens-table";

export const Route = createFileRoute("/_authenticated/voting_citizens")({
  component: () => {
    return (
      <PageHeader title="Респонденты">
        <CitizensTable />
      </PageHeader>
    );
  },
});
