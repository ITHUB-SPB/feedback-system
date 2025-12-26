import { oc } from "@orpc/contract";
import * as v from "valibot";

import { votingRegionSchema } from "@shared/database/models/voting_region";
import { baseInputAll, baseInputOne } from "./_inputs";

export const getManyVotingRegionSchema = v.array(votingRegionSchema);
export const createVotingRegionSchema = v.omit(votingRegionSchema, ["id"]);
export const updateVotingRegionSchema = v.object({
  body: v.partial(v.omit(votingRegionSchema, ["id"])),
  params: v.object({ id: v.string() }),
});

const votingRegionContract = oc
  .tag("Голосующие поселения")
  .prefix("/voting_regions")
  .router({
    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "Список голосующих районов",
      })
      .input(baseInputAll)
      .output(getManyVotingRegionSchema),

    one: oc
      .route({
        method: "GET",
        path: "/{id}",
        summary: "Информация о голосующем районе",
      })
      .input(baseInputOne)
      .output(votingRegionSchema),

    update: oc
      .route({
        method: "PATCH",
        path: "/{id}",
        inputStructure: "detailed",
        summary: "Обновление голосующего района",
      })
      .input(updateVotingRegionSchema)
      .output(votingRegionSchema),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "Добавление голосующего района",
      })
      .input(createVotingRegionSchema)
      .output(votingRegionSchema),

    delete: oc
      .route({
        method: "DELETE",
        path: "/{id}",
        summary: "Delete voting region by ID",
      })
      .input(baseInputOne),
  });

export default votingRegionContract;
