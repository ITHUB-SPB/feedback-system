import { publicProcedure } from "@shared/api";

const oneAdministrativeUnit = publicProcedure.administrativeUnit.one.handler(
  async ({ context, input, errors }) => {
    try {
      return await _baseSelect(context.db)
        .where("administrative_unit.id", "=", Number(input.id))
        .executeTakeFirstOrThrow();
    } catch (error) {
      console.error(error);
      throw errors.NOT_FOUND({
        message: `Не найдено записи с ID ${input.id}`,
      });
    }
  },
);

export default oneAdministrativeUnit;
