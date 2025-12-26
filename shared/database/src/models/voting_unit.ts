import * as v from "valibot";
import { idSchema, type GeneratedId } from "./_base";

export const votingUnitSchema = v.object({
  id: idSchema,
  title: v.pipe(v.string(), v.nonEmpty()),
  voting_region_id: idSchema,
});

export type VotingUnitTable = v.InferOutput<typeof votingUnitSchema> &
  GeneratedId;
