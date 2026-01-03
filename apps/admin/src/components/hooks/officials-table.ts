import { useEditableTable } from "@/core/refine-antd";

import type { User } from "@/types";

export default function useOfficialsTable() {
    const {
        tableProps,
        formProps,
        isEditing,
        setId,
        saveButtonProps,
        cancelButtonProps,
        editButtonProps,
        sorters,
    } = useEditableTable<User>({
        resource: "officials",
        pagination: { currentPage: 1, pageSize: 24, mode: "server" },
        sorters: {
            initial: [
                {
                    field: "lastName",
                    order: "asc",
                },
            ],
        },
        filters: {
            initial: [
                {
                    field: "role",
                    operator: "eq",
                    value: "official",
                },
            ],
        },
        successNotification: {
            message: "Операция выполнена",
            type: "success",
        },
        errorNotification(error) {
            return {
                message: `Ошибка при редактировании`,
                description: error?.message ?? "Попробуйте позже",
                type: "error",
            };
        },
    });

    return {
        tableProps,
        formProps,
        isEditing,
        setId,
        saveButtonProps,
        cancelButtonProps,
        editButtonProps,
        sorters,
    };
}
