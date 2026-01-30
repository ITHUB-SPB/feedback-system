import React from "react";

import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";

import Form, { type FormInstance, type FormProps } from "antd/es/form";
import type { ButtonProps } from "antd/es/button";
import { useForm as useFormSF, type UseFormConfig } from "sunflower-antd";

import { type BaseRecord, type CreateResponse } from "@refinedev/core";

export type UseCreateFormProps<
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends Error = Error,
  TVariables = {},
  TData extends BaseRecord = TQueryFnData,
  TResponse extends BaseRecord = TData,
  TResponseError extends Error = TError,
> = {
  onMutationSuccess?: (
    variables: TVariables,
    context: any,
    isAutoSave?: boolean,
  ) => void;
  onMutationError?: (
    error: TResponseError,
    variables: TVariables,
    context: any,
    isAutoSave?: boolean,
  ) => void;
  mutationOptions?: UseMutationOptions<
    TQueryFnData,
    TResponseError,
    TVariables,
    TResponse
  >;
} & Pick<UseFormConfig, "defaultFormValues">;

export type UseCreateFormReturnType<
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends Error = Error,
  TVariables = {},
  TData extends BaseRecord = TQueryFnData,
  TResponse extends BaseRecord = TData,
  TResponseError extends Error = TError,
> = {
  form: FormInstance<TVariables>;
  formProps: FormProps<TVariables>;
  saveButtonProps: ButtonProps & {
    onClick: () => void;
  };
  onFinish: (values: TVariables) => CreateResponse<TResponse> | void;
} & Pick<
  ReturnType<typeof useFormSF<TResponse, TVariables>>,
  "defaultFormValuesLoading"
>;

/**
 * `useForm` is used to manage forms. It uses Ant Design {@link https://ant.design/components/form/ Form} data scope management under the hood and returns the required props for managing the form actions.
 *
 * @see {@link https://refine.dev/docs/api-reference/core/hooks/useForm} for more details.
 *
 * @typeParam TData - Result data of the query extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#baserecord `BaseRecord`}
 * @typeParam TError - Custom error object that extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences/#httperror `HttpError`}
 * @typeParam TVariables - Values for params. default `{}`
 * @typeParam TData - Result data returned by the `select` function. Extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#baserecord `BaseRecord`}. Defaults to `TQueryFnData`
 * @typeParam TResponse - Result data returned by the mutation function. Extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#baserecord `BaseRecord`}. Defaults to `TData`
 * @typeParam TResponseError - Custom error object that extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#httperror `HttpError`}. Defaults to `TError`
 *
 *
 */
export const useCreateForm = <
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends Error = Error,
  TVariables = unknown,
  TData extends BaseRecord = TQueryFnData,
  TResponse extends BaseRecord = TData,
  TResponseError extends Error = TError,
>({
  onMutationSuccess,
  onMutationError,
  mutationOptions,
  defaultFormValues,
}: UseCreateFormProps<
  TQueryFnData,
  TError,
  TVariables,
  TData,
  TResponse,
  TResponseError
>): UseCreateFormReturnType<
  TQueryFnData,
  TError,
  TVariables,
  TData,
  TResponse,
  TResponseError
> => {
  const [formAnt] = Form.useForm();

  const formSF = useFormSF<TResponse, TVariables>({
    form: formAnt,
    defaultFormValues,
  });
  const { form } = formSF;

  const mutation = useMutation({
    ...mutationOptions,
  });

  const onFinish = (values: TVariables) => {
    mutation.mutate(values, {
      onSuccess: onMutationSuccess
        ? (__, _, context) => {
            onMutationSuccess?.(values, context, false);
          }
        : undefined,
      onError: onMutationError
        ? (error: TResponseError, _, context) => {
            onMutationError?.(error, values, context, false);
          }
        : undefined,
    });
  };

  const onFinishRef = React.useRef(onFinish);

  React.useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  const onKeyUp = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      form.submit();
    }
  };

  const saveButtonProps = {
    disabled: mutation.isPending,
    loading: mutation.isPending,
    onClick: () => {
      form.submit();
    },
  };

  return {
    form: formSF.form,
    formProps: {
      ...formSF.formProps,
      onFinish,
      onKeyUp,
    },
    saveButtonProps,
    defaultFormValuesLoading: formSF.defaultFormValuesLoading,
    onFinish: (values?: TVariables) =>
      onFinish(values ?? formSF.form.getFieldsValue(true)),
  };
};
