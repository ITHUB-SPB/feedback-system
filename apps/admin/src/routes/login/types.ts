import React, { type PropsWithChildren } from "react";

export type AuthPageProps<
  TWrapperProps extends {} = Record<keyof any, unknown>,
  TContentProps extends {} = Record<keyof any, unknown>,
  TFormProps extends {} = Record<keyof any, unknown>,
> = PropsWithChildren<{
  /**
   * @description The type of the auth page.
   * @default "login"
   * @optional
   */
  type?: "login";
  /**
   * @description Render a remember me button node. If set to false, remember me button will not be rendered.
   * @optional
   */
  rememberMe?: React.ReactNode;
}> & {
  /**
   * @description The props that will be passed to the wrapper component.
   * @optional
   */
  wrapperProps?: TWrapperProps;
  /**
   * @description The props that will be passed to the content component.
   * @optional
   */
  contentProps?: TContentProps;
  /**
   * @description This method gives you the ability to render a custom content node.
   * @optional
   */
  renderContent?: (
    content: React.ReactNode,
    title: React.ReactNode,
  ) => React.ReactNode;
  /**
   * @description Can be used to pass additional properties for the `Form`
   * @optional
   */
  formProps?: TFormProps;
  /**
   * @description Can be used to pass `Title`
   * @optional
   *  */
  title?: React.ReactNode;
  /**
   * @description Can be used to pass additional variables to the mutation. This is useful when you need to pass other variables to the authProvider.
   */
  mutationVariables?: Record<string, any>;
};
