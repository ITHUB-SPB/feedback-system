import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/pageHeader";
import CitizensTable from "@/components/tables/citizens-table";

export const Route = createFileRoute("/_authenticated/citizens")({
  component: () => {
    return (
      <PageHeader title="Респонденты">
        <CitizensTable />
      </PageHeader>
    );
  },
});
