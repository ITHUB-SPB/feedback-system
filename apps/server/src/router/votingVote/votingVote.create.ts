import { publicProcedure } from "@shared/api";
import _baseSelect from "./_baseSelect";

const createVotingVote =
  publicProcedure.votingVote.create.handler(
    async ({ context, input, errors }) => {
      try {
        const { id: unitId } = await context.db
          .insertInto("voting_vote")
          .values(input)
          .returning("id")
          .executeTakeFirstOrThrow();

        return await _baseSelect(context.db)
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
