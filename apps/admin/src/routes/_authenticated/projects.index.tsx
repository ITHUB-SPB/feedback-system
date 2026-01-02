import { createFileRoute } from "@tanstack/react-router";
import { dataProvider } from "@/providers/data-provider";
import ListProjects from "@/pages/project-list";


export const Route = createFileRoute("/_authenticated/projects/")({
  loader: async ({ context }) => {
    const { data: administrativeUnits } = await context.queryClient.ensureQueryData({
      queryKey: ["default", "administrative_units", "many"],
      queryFn: () =>
        dataProvider.getList({
          resource: "administrative_units",
        }),
    });

    return { administrativeUnits };
  },
  component: ListProjects,
});
