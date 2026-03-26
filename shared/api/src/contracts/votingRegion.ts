import { oc } from "@orpc/contract";
import * as v from "valibot";

import { votingRegionSchema } from "@shared/database/models/voting_region";

const votingRegionContract = oc
  .tag("Голосующие районы")
  .prefix("/voting_regions")
  .router({
    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "Список голосующих районов",
      })
      .output(v.array(votingRegionSchema)),
  });

export default votingRegionContract;
