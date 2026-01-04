import { useForm } from "@/core/refine-antd";

export function useCreateProject() {
  const { form, formProps, saveButtonProps } = useForm({
    action: "create",
    resource: "projects",
    successNotification: {
      type: "success",
      message: "Проект добавлен",
      description: "Успешно",
    },
  });

  return {
    form,
    formProps,
    saveButtonProps,
  };
}
