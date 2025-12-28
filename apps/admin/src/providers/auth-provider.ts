import { type AuthProvider } from "@refinedev/core";
import { authClient } from "../auth-client";

const authProvider: AuthProvider = {
  check: async () => {
    try {
      const { data } = await authClient.getSession();

      return {
        authenticated: Boolean(data?.session?.token)
      }
    } catch (error) {
      console.error(error)
      return {
        authenticated: false
      }
    }
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
    const { data, error } = await authClient.signIn.email({
      email,
      password,
      rememberMe: true,
    });

    // @ts-ignore
    if (data?.user?.role === "citizen") {
      return { success: false };
    }

    if (data?.token) {
      return { success: true, redirectTo: "/feedback" };
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
    console.log(error.message);
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
    return data?.user ? { ...data?.user, role: data?.role ?? "citizen" } : null;
  },
  // ...
};

export { authProvider };
