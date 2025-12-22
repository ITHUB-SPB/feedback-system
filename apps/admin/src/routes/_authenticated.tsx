import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { ThemedLayout } from "../components/layout";
import { ThemedSider } from "../components/layout/sider";
import { ThemedTitle } from "../components/layout/title";

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    const { data: session, error } = await context.authClient.getSession();

    if (!session?.user) {
      throw redirect({
        to: '/auth',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: () => (
    <ThemedLayout
      Title={ThemedTitle}
      Sider={(props) => <ThemedSider {...props} fixed />}
    >
      <Outlet />
    </ThemedLayout>
  ),
})