import { createFileRoute, redirect } from '@tanstack/react-router'
import Image from "antd/es/image";
import { LoginCard } from "./login-card";

export const Route = createFileRoute('/login/')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: search?.redirect || null
    }
  },
  beforeLoad: async ({ context, search }) => {
    const { data: session, error } = await context.authClient.getSession();

    console.log('created')
    if (session?.user) {
      throw redirect({
        to: '/feedback',
      })
    }
  },
  component: LoginComponent,
})

function LoginComponent() {
  return (
    <LoginCard
      formProps={{
        initialValues: {
          email: "@example.com",
          password: "",
        },
      }}
      renderContent={(content) => (
        <>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <Image
              src="/logos/logo_2022_black.svg"
              alt="Logo"
              style={{ maxWidth: "140px", height: "auto" }}
              preview={false}
            />
          </div>
          {content}
        </>
      )}
    />
  );
}