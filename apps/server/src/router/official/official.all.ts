import { requireModeratorProcedure } from "@shared/api";

const allOfficials = requireModeratorProcedure.official.all.handler(
  async ({ context, input, errors }) => {
    try {
      const { offset, limit, sort } = input;

      const { users, total } = await context.auth.api.listUsers({
        query: {
          offset: offset ?? 0,
          limit: limit ?? 1000,
          sortBy: sort?.at(0)?.field ?? "createdAt",
          sortDirection: sort?.at(0)?.order ?? "desc",
          filterField: "role",
          filterValue: "official",
          filterOperator: "eq",
        },
        headers: context.headers,
      });

      context.resHeaders?.set("x-total-count", String(total));

      return { data: users, total };
    } catch (error) {
      console.error(error);
      throw errors.INTERNAL_SERVER_ERROR();
    }
  },
);

export default allOfficials;
