import { type ReactElement, type PropsWithChildren } from "react";

import type { ButtonProps } from "antd/es/button";
import type {
  BaseKey,
  DeleteOneResponse,
  IQueryKeys,
  MetaQuery,
  MutationMode,
  SuccessErrorNotification,
} from "@refinedev/core";

import type { FeedbackStatusEnum, FeedbackContract } from "@/types";


type RefineButtonCommonProps = PropsWithChildren<{
  /**
   * Whether should hide the text and show only the icon or not.
   */
  hideText?: boolean;
}>;

type RefineButtonResourceProps = {
  /**
   * Resource name for API data interactions. `identifier` of the resource can be used instead of the `name` of the resource.
   * @default Inferred resource name from the route
   */
  resource: string;
};

type RefineButtonSingleProps = {
  /**
   * Data item identifier for the actions with the API
   * @default Reads `:id` from the URL
   */
  recordItemId?: BaseKey;
};

type RefineButtonURLProps = {
  /**
   * `meta` property is used when creating the URL for the related action and path.
   */
  meta?: Record<string, unknown>;
};

type RefineButtonDataProps = {
  dataProviderName?: string;
};

type RefineCreateButtonProps<
  TComponentProps extends {} = Record<string, unknown>,
  TExtraProps extends {} = {},
> = RefineButtonCommonProps &
  RefineButtonResourceProps &
  RefineButtonURLProps &
  TComponentProps &
  TExtraProps & {};

type RefineDeleteButtonProps<
  TComponentProps extends {} = Record<string, unknown>,
  TExtraProps extends {} = {},
> = RefineButtonCommonProps &
  RefineButtonResourceProps &
  RefineButtonSingleProps &
  SuccessErrorNotification &
  TComponentProps &
  TExtraProps & {
    /**
     * Callback function to be called after the delete action is successful
     */
    onSuccess?: (value: DeleteOneResponse) => void;
    /**
     * Mutation mode for the delete action
     * @default `mutationMode` setting from the `Refine` component
     */
    mutationMode?: MutationMode;
    /**
     * Additional meta data to pass to the delete mutation from the data provider
     */
    meta?: MetaQuery;
    /**
     * Target data provider name for API call to be made
     * @default `"default"`
     */
    dataProviderName?: string;
    /**
     * Text to be displayed in the confirmation popup
     * @default `"Are you sure?"` or `"buttons.confirm"` from the i18n provider
     */
    confirmTitle?: string;
    /**
     * Confirmation button text to be displayed in the confirmation popup
     * @default `"Delete"` or `"buttons.delete"` from the i18n provider
     */
    confirmOkText?: string;
    /**
     * Cancel button text to be displayed in the confirmation popup
     * @default `"Cancel"` or `"buttons.cancel"` from the i18n provider
     */
    confirmCancelText?: string;
    /**
     * Query keys to be invalidated after the delete action is successful
     * @default `["list", "many"]`
     */
    invalidates?: Array<keyof IQueryKeys | string>;
  };

type RefineEditButtonProps<
  TComponentProps extends {} = Record<string, unknown>,
  TExtraProps extends {} = {},
> = RefineButtonCommonProps &
  RefineButtonResourceProps &
  RefineButtonSingleProps &
  RefineButtonURLProps &
  TComponentProps &
  TExtraProps & {};

type RefineExportButtonProps<
  TComponentProps extends {} = Record<string, unknown>,
  TExtraProps extends {} = {},
> = RefineButtonCommonProps &
  TComponentProps &
  TExtraProps & {
    /**
     * Set the loading status of button
     */
    loading?: boolean;
  };

type RefineSaveButtonProps<
  TComponentProps extends {} = Record<string, unknown>,
  TExtraProps extends {} = {},
> = RefineButtonCommonProps & TComponentProps & TExtraProps & {};

type RefineShowButtonProps<
  TComponentProps extends {} = Record<string, unknown>,
  TExtraProps extends {} = {},
> = RefineButtonCommonProps & TComponentProps & TExtraProps & {};


export type ShowButtonProps = RefineShowButtonProps<ButtonProps>;
export type CreateButtonProps = RefineCreateButtonProps<ButtonProps>;
export type DeleteButtonProps = RefineDeleteButtonProps<ButtonProps>;
export type EditButtonProps = RefineEditButtonProps<ButtonProps>;
export type ExportButtonProps = RefineExportButtonProps<ButtonProps>;
export type SaveButtonProps = RefineSaveButtonProps<ButtonProps>;

export type DeleteButtonValues = {
  label: string;
  title: string;
  hidden: boolean;
  loading: boolean;
  disabled: boolean;
  confirmOkLabel: string;
  cancelLabel: string;
  confirmTitle: string;
  onConfirm: () => void;
};

export type ActionButtonProps = Record<
  Exclude<FeedbackStatusEnum, "pending">,
  {
    text: string;
    color: ButtonProps["color"];
    variant: ButtonProps["variant"];
    successMessage: string;
    errorMessage: string;
    commentMessage: string | null;
    icon: ReactElement | null;
  }
>;

export type ActionButtonsProps = {
  updateStatus: any;
  availableActions: FeedbackContract["outputs"]["one"]["availableActions"];
};
