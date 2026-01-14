import React, { useState, useCallback } from "react";

import type {
  QueryObserverResult,
  UseQueryOptions,
} from "@tanstack/react-query";

import type { TablePaginationConfig, TableProps } from "antd/es/table";

import {
  setInitialFilters,
  setInitialSorters,
  unionFilters,
  unionSorters,
} from '@refinedev/core'

import type {
  BaseRecord,
  HttpError,
  CrudFilter,
  CrudSort,
  GetListResponse,
  Prettify,
  SuccessErrorNotification,
  UseLoadingOvertimeOptionsProps,
  UseLoadingOvertimeReturnType,
} from "@refinedev/core";

import { useListFromQuery } from "../core/use-list-from-query";

import {
  mapAntdSorterToCrudSorting,
  mapAntdFilterToCrudFilter,
  type FilterValue,
  type SorterResult
} from "./definition";


export type BaseListProps = {
  sorters?: CrudSort[];
  filters?: CrudFilter[];
};

export type useTableFromQueryProps<TQueryFnData, TError, TData> = {
  sorters?: {
    /**
     * Initial sorter state
     */
    initial?: CrudSort[];
    /**
     * Default and unchangeable sorter state
     *  @default `[]`
     */
    permanent?: CrudSort[];
    /**
     * Whether to use server side sorting or not.
     * @default "server"
     */
    mode?: "server" | "off";
  };

  filters?: {
    /**
     * Initial filter state
     */
    initial?: CrudFilter[];
    /**
     * Default and unchangeable filter state
     *  @default `[]`
     */
    permanent?: CrudFilter[];
    /**
     * Whether to use server side filter or not.
     * @default "server"
     */
    mode?: "server" | "off";
  };
  /**
   * react-query's [useQuery](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery) options
   */
  queryOptions: ({
    filters,
    sorters
  }: {
    filters?: CrudFilter[] | undefined,
    sorters?: CrudSort[] | undefined
  }) => UseQueryOptions<
    GetListResponse<TQueryFnData>,
    TError,
    GetListResponse<TData>
  >;
} & SuccessErrorNotification<
  GetListResponse<TData>,
  TError,
  Prettify<BaseListProps>
> &
  UseLoadingOvertimeOptionsProps;

export type useTableFromQueryReturnType<
  TData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
> = {
  tableQuery: QueryObserverResult<GetListResponse<TData>, TError>;
  sorters: CrudSort[];
  setSorters: (sorter: CrudSort[]) => void;
  filters: CrudFilter[];
  setFilters: ((filters: CrudFilter[]) => void) &
  ((setter: (prevFilters: CrudFilter[]) => CrudFilter[]) => void);
  result: {
    data: TData[];
    total: number | undefined;
  };
} & UseLoadingOvertimeReturnType & {
  tableProps: TableProps<TData>;
}

const defaultPermanentFilter: CrudFilter[] = [];
const defaultPermanentSorter: CrudSort[] = [];
const EMPTY_ARRAY = Object.freeze([]) as [];

/**
 *
 * @see {@link https://refine.dev/docs/api-reference/antd/hooks/table/useTable/} for more details.
 *
 * @typeParam TQueryFnData - Result data returned by the query function. Extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#baserecord `BaseRecord`}
 * @typeParam TError - Custom error object that extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#httperror `HttpError`}
 * @typeParam TData - Result data returned by the `select` function. Extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#baserecord `BaseRecord`}. Defaults to `TQueryFnData`
 *
 */
export const useTableFromQuery = <
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TData extends BaseRecord = TQueryFnData,
>({
  filters: filtersFromProp,
  sorters: sortersFromProp,
  successNotification,
  errorNotification,
  queryOptions,
}: useTableFromQueryProps<
  TQueryFnData,
  TError,
  TData
>): useTableFromQueryReturnType<TData, TError> => {

  const isServerSideFilteringEnabled =
    (filtersFromProp?.mode || "server") === "server";
  const isServerSideSortingEnabled =
    (sortersFromProp?.mode || "server") === "server";

  const preferredInitialFilters = filtersFromProp?.initial;
  const preferredPermanentFilters =
    filtersFromProp?.permanent ?? defaultPermanentFilter;

  const preferredInitialSorters = sortersFromProp?.initial;
  const preferredPermanentSorters =
    sortersFromProp?.permanent ?? defaultPermanentSorter;

  const [sorters, setSorters] = useState<CrudSort[]>(
    setInitialSorters(preferredPermanentSorters, preferredInitialSorters ?? []),
  );

  const [filters, setFilters] = useState<CrudFilter[]>(
    setInitialFilters(preferredPermanentFilters, preferredInitialFilters ?? []),
  );

  const queryResult = useListFromQuery<TQueryFnData, TError, TData>({
    filters: isServerSideFilteringEnabled
      ? unionFilters(preferredPermanentFilters, filters)
      : undefined,
    sorters: isServerSideSortingEnabled
      ? unionSorters(preferredPermanentSorters, sorters)
      : undefined,
    queryOptions,
    // overtimeOptions,
    successNotification,
    errorNotification,
  });

  const setFiltersAsMerge = useCallback(
    (newFilters: CrudFilter[]) => {
      setFilters((prevFilters) =>
        unionFilters(preferredPermanentFilters, newFilters, prevFilters),
      );
    },
    [preferredPermanentFilters],
  );

  const setFiltersWithSetter = useCallback(
    (setter: (prevFilters: CrudFilter[]) => CrudFilter[]) => {
      setFilters((prev) =>
        unionFilters(preferredPermanentFilters, setter(prev)),
      );
    },
    [preferredPermanentFilters],
  );

  const setFiltersFn: useTableFromQueryReturnType<TQueryFnData>["setFilters"] =
    useCallback((setterOrFilters) => {
      if (typeof setterOrFilters === "function") {
        setFiltersWithSetter(setterOrFilters);
      } else {
        setFiltersAsMerge(setterOrFilters);
      }
    },
      [setFiltersWithSetter, setFiltersAsMerge],
    );

  const setSortWithUnion = useCallback(
    (newSorter: CrudSort[]) => {
      setSorters(() => unionSorters(preferredPermanentSorters, newSorter));
    },
    [preferredPermanentSorters],
  );

  const onChange = (
    _: TablePaginationConfig,
    tableFilters: Record<string, FilterValue | null>,
    sorter: SorterResult | SorterResult[],
  ) => {
    if (tableFilters && Object.keys(tableFilters).length > 0) {
      // Map Antd:Filter -> refine:CrudFilter
      setFiltersFn(mapAntdFilterToCrudFilter(
        tableFilters,
        filters,
        preferredInitialFilters,
      ));
    }

    if (sorter && Object.keys(sorter).length > 0) {
      // Map Antd:Sorter -> refine:CrudSorting
      setSortWithUnion(mapAntdSorterToCrudSorting(sorter));
    }
  };

  return {
    tableProps: {
      dataSource: queryResult.result?.data || EMPTY_ARRAY,
      loading: queryResult.query?.isLoading,
      onChange,
      pagination: false,
      scroll: { x: true },
    },
    tableQuery: queryResult.query,
    sorters,
    filters,
    setSorters: setSortWithUnion,
    setFilters: setFiltersFn,
    overtime: queryResult.overtime,
    result: queryResult.result
  };
};
