import { protectedProcedure } from "@shared/api";
import _baseSelect from "./_baseSelect";

const createAdministrativeUnit =
  protectedProcedure.administrativeUnit.create.handler(
    async ({ context, input, errors }) => {
      try {
        const { id: unitId } = await context.db
          .insertInto("administrative_unit")
          .values(input)
          .returning("id")
          .executeTakeFirstOrThrow();

        return await _baseSelect(context.db)
          .where("administrative_unit.id", "=", Number(unitId))
          .executeTakeFirstOrThrow();
      } catch (error) {
        console.error(error);
        throw errors.CONFLICT({
          message: "Ошибка при создании нового поселения",
        });
      }
    },
  );

export default createAdministrativeUnit;
