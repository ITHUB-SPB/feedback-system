import { getRouteApi } from "@tanstack/react-router";
import { useEditableTable, useSelectFromQuery } from "@/core/refine-antd";

import type {
  UserRecord,
} from "../types";

export default function useOfficialsTable() {
  const routeApi = getRouteApi("/_authenticated/officials")
  const { officialResponsibilities, administrativeUnits } = routeApi.useLoaderData()

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

  const { selectProps: administrativeUnitsSelectProps } =
    useSelectFromQuery<
      typeof administrativeUnits[0], 
      { label: string, value: number }
    >({
      data: administrativeUnits
    });

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
      result: officialResponsibilities,
      select: administrativeUnitsSelectProps,
    },
  };
}
