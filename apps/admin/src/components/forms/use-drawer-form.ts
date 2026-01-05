import { useCallback } from "react";

import type { FormInstance, FormProps } from 'antd/es/form'
import type { ButtonProps } from 'antd/es/button'
import type { DrawerProps } from 'antd/es/drawer'

import {
  type UseFormProps as UseFormPropsCore,
  type HttpError,
  type BaseRecord,
  type BaseKey,
  useInvalidate,
} from "@refinedev/core";

import { useForm, type UseFormProps, type UseFormReturnType } from "../forms/use-form";
import type { DeleteButtonProps } from "../buttons";
import { useDrawer } from "../use-drawer";

export interface UseDrawerFormConfig {
  action: "show" | "edit" | "create" | "clone";
}

export type UseDrawerFormProps<
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables = {},
  TData extends BaseRecord = TQueryFnData,
  TResponse extends BaseRecord = TData,
  TResponseError extends HttpError = TError,
> = UseFormPropsCore<
  TQueryFnData,
  TError,
  TVariables,
  TData,
  TResponse,
  TResponseError
> &
  UseFormProps<
    TQueryFnData,
    TError,
    TVariables,
    TData,
    TResponse,
    TResponseError
  > &
  UseDrawerFormConfig & {
    defaultVisible?: boolean;
    autoSubmitClose?: boolean;
    autoResetForm?: boolean;
  };

export type UseDrawerFormReturnType<
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables = {},
  TData extends BaseRecord = TQueryFnData,
  TResponse extends BaseRecord = TData,
  TResponseError extends HttpError = TError,
> = UseFormReturnType<
  TQueryFnData,
  TError,
  TVariables,
  TData,
  TResponse,
  TResponseError
> & {
  formProps: FormProps<TVariables> & {
    form: FormInstance<TVariables>;
  };
  show: (id?: BaseKey) => void;
  close: () => void;
  drawerProps: DrawerProps;
  saveButtonProps: ButtonProps;
  deleteButtonProps: DeleteButtonProps;
  formLoading: boolean;
};

/**
 * `useDrawerForm` hook allows you to manage a form within a drawer. It returns Ant Design {@link https://ant.design/components/form/ Form} and {@link https://ant.design/components/drawer/ Drawer} components props.
 *
 * @see {@link https://refine.dev/docs/api-reference/antd/hooks/form/useDrawerForm} for more details.
 *
 * @typeParam TData - Result data of the query extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#baserecord `BaseRecord`}
 * @typeParam TError - Custom error object that extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences/#httperror `HttpError`}
 * @typeParam TVariables - Values for params. default `{}`
 *
 *
 */

export const useDrawerForm = <
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables = {},
  TData extends BaseRecord = TQueryFnData,
  TResponse extends BaseRecord = TData,
  TResponseError extends HttpError = TError,
>({
  defaultVisible = false,
  autoSubmitClose = true,
  autoResetForm = true,
  invalidates,

  ...rest
}: UseDrawerFormProps<
  TQueryFnData,
  TError,
  TVariables,
  TData,
  TResponse,
  TResponseError
>): UseDrawerFormReturnType<
  TQueryFnData,
  TError,
  TVariables,
  TData,
  TResponse,
  TResponseError
> => {
  const { show, close, drawerProps } = useDrawer({
    drawerProps: {
      open: defaultVisible,
    },
  });
  const visible = drawerProps.open || false;

  const action = rest.action ?? "";

  const useFormProps = useForm<
    TQueryFnData,
    TError,
    TVariables,
    TData,
    TResponse,
    TResponseError
  >({
    meta: {
      ...rest.meta,
    },
    invalidates,
    ...rest,
  });

  const { form, formProps, formLoading, id, setId, onFinish } = useFormProps;

  const saveButtonProps = {
    disabled: formLoading,
    onClick: () => {
      form.submit();
    },
    loading: formLoading,
  };

  const deleteButtonProps = {
    recordItemId: id,
    onSuccess: () => {
      setId?.(undefined);
      close();
    },
  };

  const handleClose = useCallback(() => {
    const warnWhenConfirm = window.confirm(
      "Are you sure you want to leave? You have unsaved changes.",
    );

    if (!warnWhenConfirm) {
      return;
    }

    close();
    setId?.(undefined);
  }, []);

  const handleShow = useCallback(
    (showId?: BaseKey) => {
      if (typeof showId !== "undefined") {
        setId?.(showId);
      }
      const needsIdToOpen = action === "edit" || action === "clone";
      const hasId = typeof showId !== "undefined" || typeof id !== "undefined";
      if (needsIdToOpen ? hasId : true) {
        show();
      }
    },
    [id],
  );

  return {
    ...useFormProps,
    show: handleShow,
    close: handleClose,
    formProps: {
      form,
      ...useFormProps.formProps,
      onValuesChange: formProps?.onValuesChange,
      onKeyUp: formProps?.onKeyUp,
      onFinish: async (values) => {
        await onFinish(values);

        if (autoSubmitClose) {
          close();
        }

        if (autoResetForm) {
          form.resetFields();
        }
      },
    },
    drawerProps: {
      ...drawerProps,
      width: "500px",
      onClose: handleClose,
      open: visible,
      forceRender: true,
    },
    saveButtonProps,
    deleteButtonProps,
    formLoading,
  };
};
