import { type AuthProvider } from "@refinedev/core";
import { createAuthClient } from "@shared/auth";

export const authClient = createAuthClient({
  apiBasePath: "/api",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL!,
});

const authProvider: AuthProvider = {
  check: async () => {
    const { data: session, error } = await authClient.getSession();

    return { authenticated: Boolean(session) };
  },
  register: async ({
    email,
    password,
    firstName,
    lastName,
    middleName,
    phone,
    social,
  }) => {
    const { error } = await authClient.admin.createUser({
      name: email,
      email,
      password,
      role: "official",
      data: {
        firstName,
        lastName,
        middleName,
        phone,
        social,
      },
      fetchOptions: {
        onError: (error) => {
          throw error;
        },
      },
    });

    return { success: !error };
  },
  login: async ({ email, password }) => {
    const { data } = await authClient.signIn.email({
      email,
      password,
      rememberMe: true,
    });

    // @ts-ignore
    if (data?.user?.role === "citizen") {
      console.log("citizen login");
      return { success: false };
    }

    if (data?.token) {
      return { success: true, redirectTo: "/" };
    }

    return { success: false };
  },
  logout: async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onError: (error) => {
            throw error;
          },
        },
      });
      return { success: true, redirectTo: "/login" };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  },
  onError: async (error) => {
    if (error?.status === 401) {
      return {
        logout: true,
        error: {
          message: "Ошибка прав доступа",
          name: "Error",
          statusCode: error?.status ?? 403,
        },
      };
    }

    return {};
  },
  getIdentity: async () => {
    const { data } = await authClient.getSession();
    console.log(data);
    return data?.user ? { ...data?.user, role: data?.role ?? "citizen" } : null;
  },
  // ...
};

export { authProvider };
