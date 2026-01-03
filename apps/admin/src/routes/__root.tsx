import { useLayoutEffect, type FC, type PropsWithChildren } from "react";

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

import { useNotificationProvider } from "@/core/refine-antd";

import "antd/dist/reset.css";

import { authClient } from "@/auth-client";
import { dataProvider } from "@/providers/data-provider";
import { routerProvider } from "@/providers/router-provider";
import { orpcClient } from "@/providers/orpc-provider";
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
                overflowX: "hidden"
              },
            }
          }}
        >
          <AntdApp>
            <Refine
              dataProvider={dataProvider}
              routerProvider={routerProvider}
              notificationProvider={useNotificationProvider}
              resources={resources}
              options={{
                reactQuery: {
                  clientConfig: context.queryClient,
                },
              }}
            >
              <ScrollToTop>
                <Outlet />
              </ScrollToTop>
            </Refine>
          </AntdApp>
        </ConfigProvider >
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
