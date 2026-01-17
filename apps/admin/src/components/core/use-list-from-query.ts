import { useEffect } from "react";

import {
  type QueryObserverResult,
  type UseQueryOptions,
  useQuery,
} from "@tanstack/react-query";

import {
  useLoadingOvertime,
  useHandleNotification,
  useOnError,
} from "@refinedev/core";

import type {
  BaseRecord,
  CrudFilter,
  CrudSort,
  GetListResponse,
  HttpError,
  UseLoadingOvertimeOptionsProps,
  UseLoadingOvertimeReturnType,
} from "@refinedev/core";

import { type OpenNotificationParams } from "@/providers/notification-provider";

export type BaseListProps = {
  sorters?: CrudSort[];
  filters?: CrudFilter[];
};

export type UseListFromQueryProps<TQueryFnData, TError, TData> = {
  /**
   * Tanstack Query's [useQuery](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery) options
   */
  queryOptions: ({
    filters,
    sorters,
    meta,
  }: BaseListProps & { meta?: object }) => UseQueryOptions<
    GetListResponse<TQueryFnData>,
    TError,
    GetListResponse<TData>
  >;
} & BaseListProps & {
    successNotification: OpenNotificationParams | false | undefined;
    errorNotification:
      | OpenNotificationParams
      | false
      | undefined
      | ((error: TError) => OpenNotificationParams);
  } & UseLoadingOvertimeOptionsProps;

export type UseListFromQueryReturnType<TData, TError> = {
  query: QueryObserverResult<GetListResponse<TData>, TError>;
  result: {
    data: TData[];
    total: number | undefined;
  };
} & UseLoadingOvertimeReturnType;

const EMPTY_ARRAY = Object.freeze([]) as [];

/**
 *
 * @see {@link https://refine.dev/docs/api-reference/core/hooks/data/useList} for more details.
 *
 * @typeParam TQueryFnData - Result data returned by the query function. Extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#baserecord `BaseRecord`}
 * @typeParam TError - Custom error object that extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#httperror `HttpError`}
 * @typeParam TData - Result data returned by the `select` function. Extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#baserecord `BaseRecord`}. Defaults to `TQueryFnData`
 *
 */

export const useListFromQuery = <
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TData extends BaseRecord = TQueryFnData,
>({
  filters,
  sorters,
  queryOptions,
  successNotification,
  errorNotification,
  overtimeOptions,
}: UseListFromQueryProps<
  TQueryFnData,
  TError,
  TData
>): UseListFromQueryReturnType<TData, TError> &
  UseLoadingOvertimeReturnType => {
  const { mutate: checkError } = useOnError();
  const handleNotification = useHandleNotification();

  const preparedQueryOptions = queryOptions({
    filters,
    sorters,
  });

  const queryResponse = useQuery<
    GetListResponse<TQueryFnData>,
    TError,
    GetListResponse<TData>
  >({
    ...preparedQueryOptions,
    meta: {
      ...preparedQueryOptions?.meta,
    },
  });

  // Handle success
  useEffect(() => {
    if (queryResponse.isSuccess && queryResponse.data) {
      if (successNotification) {
        handleNotification(successNotification);
      }
    }
  }, [queryResponse.isSuccess, queryResponse.data, successNotification]);

  // Handle error
  useEffect(() => {
    if (queryResponse.isError && queryResponse.error) {
      checkError(queryResponse.error);

      const notificationConfig =
        typeof errorNotification === "function"
          ? errorNotification(queryResponse.error)
          : errorNotification;

      handleNotification(notificationConfig);
    }
  }, [queryResponse.isError, queryResponse.error?.message]);

  const { elapsedTime } = useLoadingOvertime({
    ...overtimeOptions,
    isLoading: queryResponse.isFetching,
  });

  return {
    query: queryResponse,
    result: {
      data: queryResponse?.data || EMPTY_ARRAY,
      total: queryResponse?.data?.length || 0,
    },
    overtime: { elapsedTime },
  };
};
