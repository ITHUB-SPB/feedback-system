import {
  useLayoutEffect,
  type FC,
  type PropsWithChildren,
  useMemo,
} from "react";

import {
  createRootRouteWithContext,
  Outlet,
  useLocation,
} from "@tanstack/react-router";

import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { QueryClient } from "@tanstack/react-query";

import { Refine } from "@refinedev/core";

import AntdApp from "antd/es/app";
import ConfigProvider from "antd/es/config-provider";

import "antd/dist/reset.css";

import { authClient } from "@/providers/auth-client";
import { dataProvider } from "@/providers/data-provider";
import { routerProvider } from "@/providers/router-provider";
import { orpcClient } from "@/providers/orpc-client";
import {
  useNotificationProvider,
  NotificationContextProvider,
} from "@/providers/notification-provider";

import { resources } from "@/resources";

interface RouterContext {
  queryClient: QueryClient;
  authClient: typeof authClient;
  orpcClient: typeof orpcClient;
}

const ScrollToTop: FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return children;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  loader: ({ context }) => ({ context }),
  component: () => {
    const { context } = Route.useLoaderData();

    const useNotificationProviderValues = useMemo(() => {
      return typeof useNotificationProvider === "function"
        ? useNotificationProvider
        : () => useNotificationProvider;
    }, [useNotificationProvider]);

    const notificationProviderContextValues = useNotificationProviderValues();

    return (
      <>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#1677FF",
              fontFamily: "MuseoSansCyrl",
            },
          }}
          table={{
            styles: {
              section: {
                maxHeight: "calc(100dvh - 160px)",
                overflowY: "auto",
                overflowX: "hidden",
              },
            },
          }}
        >
          <AntdApp>
            <Refine
              dataProvider={dataProvider}
              routerProvider={routerProvider}
              resources={resources}
              options={{
                reactQuery: {
                  clientConfig: context.queryClient,
                },
              }}
            >
              <NotificationContextProvider
                {...notificationProviderContextValues}
              >
                <ScrollToTop>
                  <Outlet />
                </ScrollToTop>
              </NotificationContextProvider>
            </Refine>
          </AntdApp>
        </ConfigProvider>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <ReactQueryDevtools
          buttonPosition="bottom-left"
          initialIsOpen={false}
        />
      </>
    );
  },
});
