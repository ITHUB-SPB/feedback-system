import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";

import {
  ThemedLayout,
  ThemedSider,
  ThemedHeader,
  ThemedTitle,
} from "@/components/themed-layout";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context, location }) => {
    const { data: session, error } = await context.authClient.getSession();

    if (!session?.user || session?.role === "citizen") {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }

    if (
      session.role !== "moderator" &&
      !location.pathname.includes("feedback")
    ) {
      throw redirect({
        to: "/feedback",
      });
    }

    return { session };
  },
  loader: ({ context }) => {
    return { context };
  },
  component: () => {
    const { context } = Route.useLoaderData();

    return (
      <ThemedLayout
        Title={ThemedTitle}
        Header={
          context.session.user.role === "official"
            ? () => <ThemedHeader user={context.session.user} />
            : undefined
        }
        Sider={
          context.session.user.role === "moderator"
            ? (props) => <ThemedSider {...props} user={context.session.user} fixed />
            : undefined
        }
      >
        <Outlet />
      </ThemedLayout>
    );
  },
});
