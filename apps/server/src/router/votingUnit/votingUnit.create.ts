import { requireModeratorProcedure } from "@shared/api";
import _baseSelect from "./_baseSelect";

const createVotingRegion = requireModeratorProcedure.votingUnit.create.handler(
  async ({ context, input, errors }) => {
    try {
      const { id: unitId } = await context.db
        .insertInto("voting_unit")
        .values(input)
        .returning("id")
        .executeTakeFirstOrThrow();

      return await _baseSelect(context.db)
        .where("voting_unit.id", "=", Number(unitId))
        .executeTakeFirstOrThrow();
    } catch (error) {
      console.error(error);
      throw errors.CONFLICT({
        message: "Ошибка при создании нового поселения",
      });
    }
  },
);

export default createVotingRegion;
