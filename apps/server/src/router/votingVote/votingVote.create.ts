import { publicProcedure } from "@shared/api";

const createVotingVote = publicProcedure.votingVote.create.handler(
  async ({ context, input, errors }) => {
    try {
      const { id: unitId } = await context.db
        .insertInto("voting_vote")
        .values(input)
        .returning("id")
        .executeTakeFirstOrThrow();

      return await context.db
        .selectFrom("voting_vote")
        .selectAll()
        .where("voting_vote.id", "=", Number(unitId))
        .executeTakeFirstOrThrow();
    } catch (error) {
      console.error(error);
      throw errors.CONFLICT({
        message: "Ошибка при создании нового голоса",
      });
    }
  },
);

export default createVotingVote;
