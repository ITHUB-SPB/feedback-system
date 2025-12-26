import { oc } from "@orpc/contract";
import * as v from "valibot";

import { votingVoteSchema } from "@shared/database/models/voting_vote";
import { baseInputAll, baseInputOne } from "./_inputs";

export const getVotingVoteSchema = v.object({
  ...votingVoteSchema.entries,
  voting_unit: v.optional(v.pipe(v.string(), v.nonEmpty())),
  voting_region: v.optional(v.pipe(v.string(), v.nonEmpty())),
});

export const createVotingVoteSchema = v.omit(votingVoteSchema, ["id"]);
export const getManyVotingVoteSchema = v.array(getVotingVoteSchema);

const votingVoteContract = oc
  .tag("Голосование")
  .prefix("/voting_votes")
  .router({
    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "Список всех записей голосования",
      })
      .input(baseInputAll)
      .output(getManyVotingVoteSchema),

    one: oc
      .route({
        method: "GET",
        path: "/{id}",
        summary: "Информация о записи голосования",
      })
      .input(baseInputOne)
      .output(getVotingVoteSchema),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "Добавление новой записи голосования",
      })
      .input(createVotingVoteSchema)
      .output(getVotingVoteSchema),

    delete: oc
      .route({
        method: "DELETE",
        path: "/{id}",
        summary: "Удаление записи голосования",
      })
      .input(baseInputOne),
  });

export default votingVoteContract;
