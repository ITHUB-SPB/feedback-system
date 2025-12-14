import { requireModeratorProcedure } from "@shared/api";

const deleteVotingUnit = requireModeratorProcedure.votingUnit.delete.handler(
  async ({ context, input, errors }) => {
    try {
      await context.db
        .deleteFrom("voting_unit")
        .where("voting_unit.id", "=", Number(input.id))
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

export default deleteVotingUnit;
