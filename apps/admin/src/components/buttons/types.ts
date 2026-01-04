import type { ReactElement } from "react";
import type { ButtonProps } from "antd/es/button";

import type {
  RefineCreateButtonProps,
  RefineDeleteButtonProps,
  RefineEditButtonProps,
  RefineExportButtonProps,
  RefineSaveButtonProps,
  RefineShowButtonProps,
} from "@/core/refine-types";

import type { FeedbackStatusEnum, FeedbackContract } from "@/types";

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

export type ShowButtonProps = RefineShowButtonProps<ButtonProps>;
export type CreateButtonProps = RefineCreateButtonProps<ButtonProps>;
export type DeleteButtonProps = RefineDeleteButtonProps<ButtonProps>;
export type EditButtonProps = RefineEditButtonProps<ButtonProps>;
export type ExportButtonProps = RefineExportButtonProps<ButtonProps>;
export type SaveButtonProps = RefineSaveButtonProps<ButtonProps>;
