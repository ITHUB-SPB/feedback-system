import { createFileRoute } from "@tanstack/react-router";
import Form from "antd/es/form";

import { Create } from "@/components/crud";
import CreateProjectForm from "@/forms/project-create-form";
import { useCreateProject } from "@/hooks/use-project-create";

export const Route = createFileRoute("/_authenticated/projects/create")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(
      context.orpcClient.administrativeUnit.all.queryOptions({
        input: {},
      }),
    );
  },
  component: CreateProjectPage,
});

export default function CreateProjectPage() {
  const { saveButtonProps, form, formProps } = useCreateProject();

  return (
    <Create resource="projects" saveButtonProps={saveButtonProps}>
      <Form
        form={form}
        {...formProps}
        layout="vertical"
        style={{ maxWidth: 480 }}
      >
        <CreateProjectForm />
      </Form>
    </Create>
  );
}
