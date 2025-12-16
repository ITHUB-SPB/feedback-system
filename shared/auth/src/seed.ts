import { createAuth } from "./server";
import { db } from "@shared/database";

const accounts = [
  {
    email: "moderator1@example.com",
    password: "moderator1password",
    role: "moderator",
    firstName: "M1 FirstN",
    lastName: "M1 LastN",
    middleName: "M1 MiddleN",
  },
  {
    email: "moderator2@example.com",
    password: "moderator2password",
    role: "moderator",
    firstName: "M2 FirstN",
    lastName: "M2 LastN",
    middleName: "M2 MiddleN",
  },
  {
    email: "official1@example.com",
    password: "official1password",
    role: "official",
    firstName: "O1 FirstN",
    lastName: "O1 LastN",
    middleName: "O1 MiddleN",
  },
  {
    email: "official2@example.com",
    password: "official2password",
    role: "official",
    firstName: "O2 FirstN",
    lastName: "O2 LastN",
    middleName: "O2 MiddleN",
  },
] as const;

if (!process.env?.SERVER_AUTH_SECRET) {
  console.error("SERVER_AUTH_SECRET not found");
}

const seedAuth = createAuth({
  trustedOrigins: ["http://localhost:3001"],
  serverUrl: "http://localhost:3001",
  apiPath: "/api",
  authSecret: process.env.SERVER_AUTH_SECRET!,
  db,
});

for (const { email, password, role, ...additional } of accounts) {
  try {
    await seedAuth.api.createUser({
      body: {
        email,
        password,
        name: email,
        // @ts-ignore
        role,
        data: additional
      },
    });
  } catch (error: unknown) {
    console.log(
      (error as Error).message
    );
  }
}
