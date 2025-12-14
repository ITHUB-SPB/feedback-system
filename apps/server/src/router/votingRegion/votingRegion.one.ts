import { publicProcedure } from "@shared/api";

const oneVotingRegion = publicProcedure.votingRegion.one.handler(
  async ({ context, input, errors }) => {
    try {
      return await context.db
        .selectFrom("voting_region")
        .selectAll()
        .where("voting_region.id", "=", Number(input.id))
        .executeTakeFirstOrThrow();
    } catch (error) {
      console.error(error);
      throw errors.NOT_FOUND({
        message: `Не найдено региона с ID ${input.id}`,
      });
    }
  },
);

export default oneVotingRegion;
