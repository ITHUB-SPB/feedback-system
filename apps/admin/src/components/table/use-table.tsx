import React, { Children, createElement, Fragment, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";

import Grid from 'antd/es/grid'
import Form, { type FormProps } from 'antd/es/form'
import type { TablePaginationConfig, TableProps } from "antd/es/table";

import { useForm as useFormSF } from "sunflower-antd";

import {
  type BaseRecord,
  type CrudFilters,
  type HttpError,
  useTable as useTableCore,
  type useTableProps as useTablePropsCore,
  type useTableReturnType as useTableCoreReturnType,
} from "@refinedev/core";

import {
  mapAntdSorterToCrudSorting,
  mapAntdFilterToCrudFilter,
  type FilterValue,
  type SorterResult
} from "./definition";

export type useTableProps<TQueryFnData, TError, TSearchVariables, TData> =
  useTablePropsCore<TQueryFnData, TError, TData> & {
    onSearch?: (data: TSearchVariables) => CrudFilters | Promise<CrudFilters>;
  };

export type useTableReturnType<
  TData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TSearchVariables = unknown,
> = useTableCoreReturnType<TData, TError> & {
  searchFormProps: FormProps<TSearchVariables>;
  tableProps: TableProps<TData>;
};

export type PaginationLinkProps = {
  to: string,
  element: ReactNode
};

export function PaginationLink({ to, element }: PaginationLinkProps) {
  return (
    <Link to={to}>{element}</Link>
  )
};

/**
 * By using useTable, you are able to get properties that are compatible with
 * Ant Design {@link https://ant.design/components/table/ `<Table>`} component.
 * All features such as sorting, filtering and pagination comes as out of box.
 *
 * @see {@link https://refine.dev/docs/api-reference/antd/hooks/table/useTable/} for more details.
 *
 * @typeParam TQueryFnData - Result data returned by the query function. Extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#baserecord `BaseRecord`}
 * @typeParam TError - Custom error object that extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#httperror `HttpError`}
 * @typeParam TSearchVariables - Values for search params
 * @typeParam TData - Result data returned by the `select` function. Extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#baserecord `BaseRecord`}. Defaults to `TQueryFnData`
 *
 */
export const useTable = <
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TSearchVariables = unknown,
  TData extends BaseRecord = TQueryFnData,
>({
  onSearch,
  pagination: paginationFromProp,
  filters: filtersFromProp,
  sorters: sortersFromProp,
  resource,
  successNotification,
  errorNotification,
  queryOptions,
  meta,
  dataProviderName,
}: useTableProps<
  TQueryFnData,
  TError,
  TSearchVariables,
  TData
> = {}): useTableReturnType<TData, TError, TSearchVariables> => {
  const {
    tableQuery,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    filters,
    setFilters,
    sorters,
    setSorters,
    createLinkForSyncWithLocation,
    pageCount,
    overtime,
    result,
  } = useTableCore<TQueryFnData, TError, TData>({
    pagination: paginationFromProp,
    filters: filtersFromProp,
    sorters: sortersFromProp,
    resource,
    successNotification,
    errorNotification,
    queryOptions,
    meta,
    dataProviderName,
  });
  const breakpoint = Grid.useBreakpoint();
  const [form] = Form.useForm<TSearchVariables>();
  const formSF = useFormSF<any, TSearchVariables>({
    form: form,
  });
  const isPaginationEnabled = paginationFromProp?.mode !== "off";

  const preferredInitialFilters = filtersFromProp?.initial;

  const { data, isFetched, isLoading } = tableQuery;

  const onChange = (
    paginationState: TablePaginationConfig,
    tableFilters: Record<string, FilterValue | null>,
    sorter: SorterResult | SorterResult[],
  ) => {
    if (tableFilters && Object.keys(tableFilters).length > 0) {
      // Map Antd:Filter -> refine:CrudFilter
      const crudFilters = mapAntdFilterToCrudFilter(
        tableFilters,
        filters,
        preferredInitialFilters,
      );
      setFilters(crudFilters);
    }

    if (sorter && Object.keys(sorter).length > 0) {
      // Map Antd:Sorter -> refine:CrudSorting
      const crudSorting = mapAntdSorterToCrudSorting(sorter);
      setSorters(crudSorting);
    }

    if (isPaginationEnabled) {
      setCurrentPage?.(paginationState.current || 1);
      setPageSize?.(paginationState.pageSize || 12);
    }
  };

  const onFinish = async (value: TSearchVariables) => {
    if (onSearch) {
      const searchFilters = await onSearch(value);
      setFilters(searchFilters);

      if (isPaginationEnabled) {
        setCurrentPage?.(1);
      }
    }
  };

  const antdPagination = (): TablePaginationConfig => ({
    itemRender: (page, type, element) => {
      const link = createLinkForSyncWithLocation({
        pagination: {
          pageSize,
          currentPage: page,
        },
        sorters,
        filters,
      });

      if (type === "page") {
        return <Link to={link}>{page}</Link>
      }

      if (type === "next" || type === "prev") {
        return <Link to={link}>{element}</Link>
      }

      if (type === "jump-next" || type === "jump-prev") {
        const elementChildren = (element as React.ReactElement<any>)?.props
          ?.children;

        return <Link to={link}>{
          Children.count(elementChildren) > 1
            ? createElement(Fragment, {}, elementChildren)
            : elementChildren
        }</Link>
      }

      return element;
    },
    pageSize,
    current: currentPage,
    simple: !breakpoint.sm,
    position: !breakpoint.sm ? ["bottomCenter"] : ["bottomRight"],
    total: data?.total,
  })

  return {
    searchFormProps: {
      ...formSF.formProps,
      onFinish,
    },
    tableProps: {
      dataSource: data?.data,
      loading: isLoading,
      onChange,
      pagination:
        isPaginationEnabled
          ? antdPagination()
          : false,
      scroll: { x: true },
    },
    tableQuery,
    sorters,
    filters,
    setSorters,
    setFilters,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    pageCount,
    createLinkForSyncWithLocation,
    overtime,
    result,
  };
};
