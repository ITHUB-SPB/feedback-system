import type { DataProvider } from "@refinedev/core";
import type { authClient } from "./auth-provider";

const API_URL = import.meta.env.VITE_API_BASE_URL! + "/api";

const fetcher = async (url: string, options?: RequestInit) => {
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...options?.headers,
    },
  });
};

export const dataProvider: DataProvider = {
  getOne: async ({ resource, id, meta }) => {
    const url =
      resource === "auth/admin/list-users"
        ? `${API_URL}/auth/admin/get-user?id=${id}`
        : `${API_URL}/${resource}/${id}`;

    const response = await fetcher(url);
    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.json();

    return { data };
  },
  update: async ({ resource, id, variables }) => {
    const updateOptions =
      resource === "auth/admin/list-users"
        ? {
          method: "POST",
          body: JSON.stringify({
            userId: id,
            data: variables,
          }),
        }
        : { method: "PATCH", body: JSON.stringify(variables) };

    const url =
      resource === "auth/admin/list-users"
        ? `${API_URL}/auth/admin/update-user`
        : `${API_URL}/${resource}/${id}`;

    console.log({
      ...updateOptions,
      headers: {
        "Content-Type": "application/json",
      },
    })

    const response = await fetcher(url, {
      ...updateOptions,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.json();

    return { data };
  },
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    if (resource === "auth/admin/list-users") {
      const query: { [K: string]: string } = {} satisfies Parameters<
        typeof authClient.admin.listUsers
      >[0]["query"];

      if (pagination?.pageSize && pagination?.currentPage) {
        Object.assign(query, {
          limit: pagination?.pageSize,
          offset: (pagination?.currentPage - 1) * pagination?.pageSize,
        });
      }

      if (sorters?.at(0)) {
        Object.assign(query, {
          sortBy: sorters?.at(0)?.field,
          sortDirection: sorters?.at(0)?.order,
        });
      }

      if (filters?.at(0)) {
        const firstFilter = filters?.at(0);
        if (firstFilter && "field" in firstFilter) {
          Object.assign(query, {
            filterField: firstFilter.field,
            filterValue: firstFilter.value,
            filterOperator: firstFilter.operator,
          });
        }
      }

      const params = new URLSearchParams();
      for (const param in query) {
        params.set(param, query[param]);
      }

      const response = await fetcher(
        `${API_URL}/auth/admin/list-users?${params.toString()}`,
      );

      if (response.status < 200 || response.status > 299) throw response;

      const { users } = await response.json();
      const total = Number(response.headers.get("x-total-count")) || 0;

      return {
        data: users,
        total,
      };
    }

    const params = new URLSearchParams();

    if (pagination && pagination.currentPage && pagination.pageSize) {
      params.append(
        "offset",
        String((pagination.currentPage - 1) * pagination.pageSize),
      );
      params.append("limit", String(pagination.pageSize));
    }

    if (sorters && sorters.length > 0) {
      for (const sorter of sorters) {
        params.append("sort", `${sorter.field}.${sorter.order}`);
      }
    }

    if (filters && filters.length > 0) {
      for (const filter of filters) {
        if (
          "field" in filter &&
          ["eq", "ne", "lt", "gt", "in"].includes(filter.operator)
        ) {
          params.append(
            "filter",
            `${filter.field}[${filter.operator}]${filter.value}`,
          );
        }
      }
    }

    if (meta?.export) {
      params.append("export", "true");
    }

    const response = await fetcher(
      `${API_URL}/${resource}?${params.toString()}`,
    );

    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.json();
    const total = Number(response.headers.get("x-total-count")) || 0;

    return {
      data,
      total,
    };
  },
  getMany: async ({ resource, ids, meta }) => {
    const params = new URLSearchParams();

    if (ids?.length) {
      const idsString = [...new Set(ids)].map(String).join(",");
      params.append("filter", `id[in]${idsString}`);
    }

    const paramsString = params.size !== 0 ? `?${params.toString()}` : "";

    const response = await fetcher(`${API_URL}/${resource}${paramsString}`);

    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.json();

    return { data };
  },
  create: async ({ resource, variables }) => {
    const response = await fetcher(`${API_URL}/${resource}`, {
      method: "POST",
      body: JSON.stringify(variables),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.json();

    return { data };
  },
  deleteOne: async ({ resource, id }) => {
    const response = await fetcher(`${API_URL}/${resource}/${id}`, {
      method: "DELETE",
    });

    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.json();

    return { data };
  },
  getApiUrl: () => API_URL,
  // createMany: () => { /* ... */ },
  // deleteMany: () => { /* ... */ },
  // updateMany: () => { /* ... */ },
  // custom: () => { /* ... */ },
};
