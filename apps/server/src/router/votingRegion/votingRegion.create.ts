import { requireModeratorProcedure } from "@shared/api";

const createVotingRegion =
  requireModeratorProcedure.votingRegion.create.handler(
    async ({ context, input, errors }) => {
      try {
        const { id: unitId } = await context.db
          .insertInto("voting_region")
          .values(input)
          .returning("id")
          .executeTakeFirstOrThrow();

        return await context.db
          .selectFrom("voting_region")
          .selectAll()
          .where("voting_region.id", "=", Number(unitId))
          .executeTakeFirstOrThrow();
      } catch (error) {
        console.error(error);
        throw errors.CONFLICT({
          message: "Ошибка при создании нового региона",
        });
      }
    },
  );

export default createVotingRegion;
