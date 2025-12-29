import { useList } from "@refinedev/core";
import { useEditableTable, useSelect } from "@refinedev/antd";

import type { AdministrativeUnitRecord, IResponsibility, UserRecord } from "../types";


export default function useOfficialsTable() {
    const {
        tableProps,
        formProps,
        isEditing,
        setId: setEditId,
        saveButtonProps,
        cancelButtonProps,
        editButtonProps,
        sorters,
    } = useEditableTable<UserRecord>({
        resource: "auth/admin/list-users",
        pagination: { currentPage: 1, pageSize: 24 },
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

    const { result: administrativeUnits, query: administrativeUnitsQuery } =
        useList<IResponsibility>({
            resource: "official_responsibilities",
            pagination: {
                pageSize: 48,
            },
            filters: [
                {
                    field: "official_id",
                    operator: "in",
                    value: tableProps?.dataSource?.map((official) => official.id) ?? [],
                },
            ],
        });

    const { selectProps: administrativeUnitsSelectProps } = useSelect<AdministrativeUnitRecord>({
        resource: "administrative_units",
        pagination: {
            pageSize: 48,
        }
    }) 

    return {
        table: {
            tableProps,
            formProps,
            isEditing,
            setId: setEditId,
            saveButtonProps,
            cancelButtonProps,
            editButtonProps,
            sorters,
        },
        administrativeUnits: {
            result: administrativeUnits,
            query: administrativeUnitsQuery,
            select: administrativeUnitsSelectProps
        },
    };
}
