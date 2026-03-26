import { requireModeratorProcedure } from "@shared/api";
import { type Tables } from "@shared/database";

const allOfficialResponsibilities =
  requireModeratorProcedure.officialResponsibility.all.handler(
    async ({ context, input, errors }) => {
      try {
        const { filter, sort, offset, limit } = input;

        let query = context.db
          .selectFrom("official_responsibility")
          .innerJoin(
            "administrative_unit",
            "administrative_unit.id",
            "official_responsibility.administrative_unit_id",
          )
          .innerJoin("user", "user.id", "official_responsibility.official_id")
          .select([
            "official_responsibility.id",
            "official_responsibility.official_id",
            "official_responsibility.administrative_unit_id",
            "administrative_unit.title as administrative_unit",
            "user.firstName as officialFirstName",
            "user.lastName as officialLastName",
            "user.middleName as officialMiddleName",
          ]);

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
              | keyof Tables["official_responsibility"]
              | keyof Tables["administrative_unit"]
              | keyof Tables["user"];

            if (column === "id") {
              column =
                "official_responsibility.id" as keyof Tables["official_responsibility"];
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

            query = query.where(
              column,
              mapOperatorsToSql[operator],
              value as number | number[],
            );
          }
        }

        if (sort !== undefined) {
          for (const sortExpression of sort) {
            let [field, order] = sortExpression.split(".");
            if (field === "official_id") {
              query = query
                .orderBy("user.lastName", order as "desc" | "asc")
                .orderBy("user.firstName", order as "desc" | "asc");
            }
            if (field === "administrative_unit_id") {
              query = query.orderBy(
                "administrative_unit.title",
                order as "desc" | "asc",
              );
            }
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

        return await query.execute();
      } catch (error) {
        console.error(error);
        throw errors.INTERNAL_SERVER_ERROR();
      }
    },
  );

export default allOfficialResponsibilities;
