import { createFileRoute, redirect } from '@tanstack/react-router'

import { TextField } from "../../../components/fields/text";
import { NumberField } from "../../../components/fields/number";
import { Show } from "../../../components/crud/show";
import { DeleteButton } from '../../../components/buttons/delete';
import { dataProvider } from '../../../providers/data-provider';

import Typography from "antd/es/typography";


export const Route = createFileRoute('/_authenticated/projects/$showId')({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const { data: project } = await context.queryClient.ensureQueryData({
      queryKey: ["default", "feedback", "one", params.showId],
      queryFn: () => dataProvider.getOne({
        resource: "projects",
        id: Number(params.showId)
      })
    })
    return project
  }
})

function RouteComponent() {
  const project = Route.useLoaderData()
  const navigate = Route.useNavigate()

  return (
    <Show title="Информация о проекте" footerButtons={() => {
      return <DeleteButton resource='projects' recordItemId={project.id} onSuccess={() => {
        navigate({ from: Route.fullPath, to: '/projects' })
      }} />
    }}>
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
}
