import { useState } from "react";
import { useList, useMany, useCreate } from "@refinedev/core";

import {
  useEditableTable,
  useSelect,
  useModalForm,
} from "@refinedev/antd";

import type { IResponsibility, PersonRecord } from './types'

export function useAttach() {
  const { mutate: attachOfficial, mutation: attachOfficialMutation } =
    useCreate<IResponsibility>({
      resource: "official_responsibilities",
    });

  const [isAttaching, setIsAttaching] = useState(false);
  const [attachingUnitId, setAttachingUnitId] = useState<number | null>(null);
  const [attachingOfficialId, setAttachingOfficialId] = useState<string | null>(
    null,
  );

  return {
    attachOfficial,
    attachOfficialMutation,
    isAttaching,
    setIsAttaching,
    attachingUnitId,
    setAttachingUnitId,
    attachingOfficialId,
    setAttachingOfficialId,
  }
}

export function useAssignOfficialModalForm() {
  const {
    modalProps: assignOfficialModalProps,
    formProps: assignOfficialFormProps,
    show: assignOfficialModalShow,
  } = useModalForm<IResponsibility>({
    resource: "official_responsibilities",
    action: "create",
    redirect: false,
  });

  return {
    assignOfficialModalProps,
    assignOfficialFormProps,
    assignOfficialModalShow
  }
}

export function useAdministrativeUnitsTable() {
  const {
    tableProps,
    formProps,
    isEditing,
    sorters,
    setId,
    saveButtonProps,
    cancelButtonProps,
    editButtonProps,
  } = useEditableTable({
    resource: "administrative_units",
    pagination: { currentPage: 1, pageSize: 24 },
    sorters: {
      initial: [
        {
          field: "title",
          order: "asc",
        },
      ],
    },
  });

  const { result: responsibilities, query: responsibilitiesQuery } =
    useList<IResponsibility>({
      resource: "official_responsibilities",
      pagination: {
        pageSize: 48,
      },
      filters: [
        {
          field: "administrative_unit.id",
          operator: "in",
          value:
            tableProps?.dataSource?.map(
              (administrative_unit) => administrative_unit.id,
            ) ?? [],
        },
      ],
    });

  const { result: unitTypes, query: unitTypesQuery } = useMany({
    resource: "administrative_unit_types",
    ids: tableProps?.dataSource?.map((unit) => unit.unit_type_id) ?? [],
  });

  return {
    table: {
      tableProps,
      formProps,
      isEditing,
      sorters,
      setId,
      saveButtonProps,
      cancelButtonProps,
      editButtonProps,
    },
    responsibilities: {
      responsibilities,
      responsibilitiesQuery
    },
    unitTypes: {
      unitTypes,
      unitTypesQuery
    },
  }
}

export function useOfficials() {
  const { selectProps: officialsSelectProps } = useSelect<PersonRecord>({
    optionLabel: (item) =>
      `${item.lastName} ${item.firstName} ${item?.middleName ?? ""}`,
    optionValue: (item) => String(item.id),
    resource: "auth/admin/list-users",
    pagination: {
      pageSize: 48,
    },
    filters: [
      {
        field: "role",
        operator: "eq",
        value: "official",
      },
    ],
  });

  return { officialsSelectProps }
}

export function useAdministrativeUnits() {
  const { selectProps: administrativeUnitsSelectProps } = useSelect({
    resource: "administrative_units",
    pagination: {
      pageSize: 48,
    },
  });

  return { administrativeUnitsSelectProps }
}