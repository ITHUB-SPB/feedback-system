import { requireModeratorProcedure } from "@shared/api";

const deleteAdministrativeUnit =
  requireModeratorProcedure.administrativeUnit.delete.handler(
    async ({ context, input, errors }) => {
      try {
        await context.db
          .deleteFrom("administrative_unit")
          .where("administrative_unit.id", "=", Number(input.id))
          .executeTakeFirstOrThrow();
        return { status: "ok" };
      } catch (error) {
        console.error(error);
        throw errors.CONFLICT({
          message: `Ошибка при удалении поселения с ID ${input.id}`,
        });
      }
    },
  );

export default deleteAdministrativeUnit;
