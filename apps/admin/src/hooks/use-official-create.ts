import { useNavigate } from "@tanstack/react-router";
import { useInvalidate, type HttpError } from "@refinedev/core";

import { useModalForm } from "@/components/forms/use-modal-form";
import type { NewUserRecord } from "@/types";

export default function useOfficialCreate() {
  const navigate = useNavigate();
  const invalidate = useInvalidate();

  const {
    modalProps: createOfficialModalProps,
    formProps: createOfficialFormProps,
    show: createOfficialModalShow,
  } = useModalForm<NewUserRecord, HttpError>({
    action: "create",
    resource: "officials",
    onMutationSuccess: () => {
      navigate({ from: "/officials", to: "/officials" });
      invalidate({
        resource: "officials",
        invalidates: ["all"],
      });
      invalidate({
        resource: "auth/admin/list-users",
        invalidates: ["all"],
      });
    },
    defaultFormValues: {
      password: crypto.randomUUID().slice(0, 8),
      role: "official",
      middleName: "",
    },
    successNotification: {
      message: "Аккаунт успешно создан",
      type: "success",
    },
    errorNotification(error) {
      return {
        message: `Ошибка при создании аккаунта`,
        description: error?.message ?? "Попробуйте позже",
        type: "error",
      };
    },
  });

  return {
    createOfficialModalProps,
    createOfficialFormProps,
    createOfficialModalShow,
  };
}
