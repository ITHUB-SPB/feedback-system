import { publicProcedure } from "@shared/api";
import { type Tables } from "@shared/database";
import _baseSelect from "./_baseSelect";

const allFeedback = publicProcedure.feedback.all.handler(
  async ({ context, input, errors }) => {
    try {
      const { offset, limit, sort, filter } = input;

      let query = _baseSelect(context.db);

      if (filter?.length) {
        const mapOperatorsToSql = {
          eq: "=",
          ne: "!=",
          lt: "<",
          gt: ">",
          in: "in",
        } as const;

        type WhereValue = string | number | string[] | number[];

        for (const filterExpression of filter) {
          const matchResult =
            decodeURI(filterExpression).match(/(.*)\[(.*)\](.*)/);

          if (matchResult === null) {
            continue;
          }

          let column = matchResult[1] as
            | keyof Tables["feedback"]
            | keyof Tables["topic"]
            | keyof Tables["project"]
            | keyof Tables["feedback_status"]
            | keyof Tables["feedback_type"];

          if (column === "id") {
            column = "feedback.id" as keyof Tables["feedback"];
          }

          if (column === "status.id") {
            column = "feedback.feedback_status_id" as keyof Tables["feedback"];
          }

          const operator = matchResult[2] as keyof typeof mapOperatorsToSql;

          let value: WhereValue = Number.isFinite(+matchResult[3])
            ? +matchResult[3]
            : matchResult[3];

          if (operator === "in" && typeof value === "string") {
            const items = value.split(",");
            value = items.some((item) => !Number.isFinite(+item))
              ? items
              : items.map(Number);
          } else if (operator === "in" && typeof value === "number") {
            value = Array.isArray(value) ? value : [value];
          }

          query = query.where(column, mapOperatorsToSql[operator], value);
        }
      }

      if (sort !== undefined) {
        for (const sortExpression of sort) {
          let [field, order] = sortExpression.split(".");

          if (field === "created_at") {
            field = "feedback.created_at";
          }

          query = query.orderBy(
            field as keyof Tables["feedback"],
            order as "desc" | "asc",
          );
        }
      }

      const total = (await query.execute()).length;
      context.resHeaders?.set("x-total-count", String(total));

      if (limit !== undefined) {
        query = query.limit(limit);
      }

      if (offset !== undefined) {
        query = query.offset(offset);
      }

      const results = (await query.execute()).map((result) => ({
        ...result,
        created_at: new Date(result.created_at).toISOString(),
      }));

      const publicFieldsOnly = !context.session?.user?.role;

      return publicFieldsOnly
        ? results.map(
          ({
            project_id,
            created_at,
            description,
            feedback_type,
            status,
            feedback_status_comment,
          }) => ({
            project_id,
            created_at,
            description,
            feedback_type,
            status,
            feedback_status_comment,
          }),
        )
        : results;
    } catch (error) {
      console.error(error);
      throw errors.INTERNAL_SERVER_ERROR();
    }
  },
);

export default allFeedback;
