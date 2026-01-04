import { createFileRoute } from "@tanstack/react-router";
import Form from "antd/es/form";

import { Edit } from "@/components/layouts";
import EditProjectForm from "@/components/forms/project-edit-form";
import { useProjectEdit } from "@/components/hooks/use-project-edit";

export const Route = createFileRoute("/_authenticated/projects/$editId/edit")({
  params: {
    parse: (p) => ({
      editId: Number(p.editId),
    }),
  },
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(
      context.orpcClient.administrativeUnit.all.queryOptions({
        input: {},
      }),
    );
  },
  component: () => {
    const { editId } = Route.useParams();
    const form = useProjectEdit(editId);

    return (
      <Edit
        canDelete
        resource="projects"
        title="Редактирование проекта"
        recordItemId={editId}
        saveButtonProps={form.saveButtonProps}
      >
        <Form {...form.formProps} form={form.form} layout="vertical">
          <EditProjectForm />
        </Form>
      </Edit>
    );
  },
});
