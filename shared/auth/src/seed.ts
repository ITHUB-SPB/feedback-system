import { createAuth } from "./server";
import { db } from "@shared/database";

type Account = {
  email: string;
  name: string;
  password: string;
  role: "superadmin" | "moderator" | "official";
};

const accounts: Account[] = [
  {
    email: "superadmin@example.com",
    name: "superadmin",
    password: "superadminpassword",
    role: "superadmin",
  },
  {
    email: "moderator1@example.com",
    name: "moderator1",
    password: "moderator1password",
    role: "moderator",
  },
  {
    email: "moderator2@example.com",
    name: "moderator2",
    password: "moderator2password",
    role: "moderator",
  },
  {
    email: "official1@example.com",
    name: "official1",
    password: "official1password",
    role: "official",
  },
  {
    email: "official2@example.com",
    name: "official2",
    password: "official2password",
    role: "official",
  },
];

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

for (const account of accounts) {
  try {
    await seedAuth.api.createUser({
      body: account,
    });
  } catch {}
  console.log(
    await seedAuth.api.listUsers({
      query: {
        limit: 10,
      },
    }),
  );
}
