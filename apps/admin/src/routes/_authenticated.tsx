import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'

import { ThemedLayout } from "../components/layout";
import { ThemedSider } from "../components/layout/sider";
import { ThemedTitle } from "../components/layout/title";
import ThemedHeader from '../components/layout/header';


export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    const { data: session, error } = await context.authClient.getSession();

    if (!session?.user) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }

    if (session.role !== "moderator" && !location.pathname.includes("feedback")) {
      throw redirect({
        to: '/feedback',
      })
    }

    return { session }
  },
  loader: ({ context }) => {
    return { context }
  },
  component: () => {
    const { context } = Route.useLoaderData()
    const { user } = context.session

    return (
      <ThemedLayout
        Title={ThemedTitle}
        Header={user.role === "official" ? () => <ThemedHeader user={user} /> : undefined}
        Sider={user.role === "moderator" ? (props) => <ThemedSider {...props} fixed /> : undefined}
      >
        <Outlet />
      </ThemedLayout>
    )
  }
})