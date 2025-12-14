import { requireModeratorProcedure } from "@shared/api";
import _baseSelect from "./_baseSelect";

const createOfficialResponsibility =
  requireModeratorProcedure.officialResponsibility.create.handler(
    async ({ context, input, errors }) => {
      try {
        const { id: officialResponsibilityId } = await context.db
          .insertInto("official_responsibility")
          .values(input)
          .returning("id")
          .executeTakeFirstOrThrow();

        return await _baseSelect(context.db)
          .where(
            "official_responsibility.id",
            "=",
            Number(officialResponsibilityId),
          )
          .executeTakeFirstOrThrow();
      } catch (error) {
        console.error(error);
        throw errors.CONFLICT({
          message: "Ошибка при создании новой пары",
        });
      }
    },
  );

export default createOfficialResponsibility;
