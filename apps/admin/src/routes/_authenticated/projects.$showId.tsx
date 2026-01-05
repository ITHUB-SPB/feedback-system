import { createFileRoute } from "@tanstack/react-router";
import Typography from "antd/es/typography";

import { TextField, NumberField } from "@/components/fields";
import { Show } from "@/components/crud";
import { useProjectShow } from "@/hooks/use-project-show";

export const Route = createFileRoute("/_authenticated/projects/$showId")({
  params: {
    parse: (p) => ({
      showId: Number(p.showId),
    }),
  },
  loader: async ({ context, params }) => {
    context.queryClient.ensureQueryData(
      context.orpcClient.project.one.queryOptions({
        input: {
          id: Number(params.showId),
        },
      }),
    );
  },
  component: () => {
    const { showId } = Route.useParams();
    const navigate = Route.useNavigate();
    const { project, isLoading } = useProjectShow(showId);

    return (
      <Show
        isLoading={isLoading}
        title="Информация о проекте"
        resource="projects"
        recordItemId={showId}
        deleteButtonProps={{
          onSuccess: () => {
            navigate({ to: "/projects" });
          },
        }}
        canEdit
        canDelete
      >
        <Typography.Title level={5}>Название</Typography.Title>
        <TextField value={project?.title} />

        <Typography.Title level={5}>Территория</Typography.Title>
        <TextField value={project?.administrative_unit} />

        <Typography.Title level={5}>Год реализации</Typography.Title>
        <TextField value={project?.year_of_completion} />

        <Typography.Title level={5}>Широта</Typography.Title>
        <NumberField value={project?.latitude} />

        <Typography.Title level={5}>Долгота</Typography.Title>
        <NumberField value={project?.longitude} />
      </Show>
    );
  },
});
