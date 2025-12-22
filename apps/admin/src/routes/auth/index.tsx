import { createFileRoute } from '@tanstack/react-router'
import Image from "antd/es/image";
import { LoginCard } from "./login-card";

export const Route = createFileRoute('/auth/')({
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