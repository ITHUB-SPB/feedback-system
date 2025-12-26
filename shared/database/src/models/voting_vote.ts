import * as v from "valibot";
import { idSchema, type GeneratedId, type GeneratedTime } from "./_base";

export const votingVoteSchema = v.object({
  id: idSchema,
  voting_unit_id: idSchema,
  username: v.pipe(v.string(), v.nonEmpty()),
  description: v.pipe(v.string(), v.nonEmpty()),
  created_at: v.union([
    v.pipe(v.date(), v.transform(String)),
    v.pipe(v.string(), v.isoTimestamp()),
    v.pipe(v.string(), v.isoDateTime()),
  ]),
});

export type VotingVoteTable = v.InferOutput<typeof votingVoteSchema> &
  GeneratedId &
  GeneratedTime;
