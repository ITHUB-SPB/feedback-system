import { useList, type HttpError } from "@refinedev/core";
import {
  useEditableTable,
  useModalForm,
} from "@refinedev/antd";

import type { NewUserRecord, UserRecord } from './_types'


export function useOfficialsTable() {
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
      type: "success"
    },
    errorNotification(error) {
      return {
        message: `Ошибка при редактировании`,
        description: error?.message ?? "Попробуйте позже",
        type: "error"
      }
    }
  })

  const { result: administrativeUnits, query: administrativeUnitsQuery } =
    useList({
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
      query: administrativeUnitsQuery
    }
  }
}

export function useCreateOfficial() {
  const {
    modalProps: createOfficialModalProps,
    formProps: createOfficialFormProps,
    show: createOfficialModalShow,
  } = useModalForm<NewUserRecord, HttpError>({
    action: "create",
    resource: "/auth/admin/create-user",
    redirect: false,
    defaultFormValues: {
      role: "official",
    },
    successNotification: {
      message: "Аккаунт успешно создан",
      type: "success"
    },
    errorNotification(error) {
      return {
        message: `Ошибка при создании аккаунта`,
        description: error?.message ?? "Попробуйте позже",
        type: "error"
      }
    },
  });

  return {
    createOfficialModalProps,
    createOfficialFormProps,
    createOfficialModalShow
  }
}