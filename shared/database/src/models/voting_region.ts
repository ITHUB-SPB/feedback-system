import * as v from "valibot";
import { idSchema, type GeneratedId } from "./_base";

export const votingRegionSchema = v.object({
  id: idSchema,
  title: v.pipe(v.string(), v.nonEmpty()),
});

export type VotingRegionTable = v.InferOutput<typeof votingRegionSchema> &
  GeneratedId;
