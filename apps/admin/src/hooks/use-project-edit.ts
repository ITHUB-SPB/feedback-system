import { useForm } from "@/components/forms/use-form";

export function useProjectEdit(editId: number) {
  const { formProps, saveButtonProps, query, form } = useForm({
    resource: "projects",
    id: editId,
    redirect: "show",
  });

  return {
    form,
    formProps,
    saveButtonProps,
  };
}
