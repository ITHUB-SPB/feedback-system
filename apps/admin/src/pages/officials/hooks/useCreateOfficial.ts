import { type HttpError } from "@refinedev/core";
import { useModalForm } from "@refinedev/antd";
import { useNavigate } from "@tanstack/react-router";

import type { NewUserRecord } from "../types";

export default function useCreateOfficial() {
    const navigate = useNavigate()

    const {
        modalProps: createOfficialModalProps,
        formProps: createOfficialFormProps,
        show: createOfficialModalShow,
    } = useModalForm<NewUserRecord, HttpError>({
        action: "create",
        resource: "/auth/admin/create-user",
        onMutationSuccess: () => {
            navigate({ from: "/officials", to: "/officials" })
        },
        invalidates: ["resourceAll"],
        defaultFormValues: {
            password: crypto.randomUUID().slice(0, 8),
            role: "official",
            middleName: ""
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
