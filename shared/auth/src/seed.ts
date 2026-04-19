import { createAuth } from "./server";
import { db } from "@shared/database";

const accounts = [
  {
    email: "moderator1@example.com",
    password: "moderator1password",
    role: "moderator",
    firstName: "Модератор",
    lastName: "Тестовый",
    middleName: "Первый",
  },
  {
    email: "moderator2@example.com",
    password: "moderator2password",
    role: "moderator",
    firstName: "Модератор",
    lastName: "Тестовый",
    middleName: "Второй",
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
        data: additional,
      },
    });
  } catch (error: unknown) {
    console.log((error as Error).message);
  }
}
