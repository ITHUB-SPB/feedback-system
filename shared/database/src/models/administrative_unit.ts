import * as v from "valibot";
import { idSchema, type GeneratedId } from "./_base";

export const administrativeUnitSchema = v.object({
  id: idSchema,
  title: v.pipe(v.string()),
  unit_type_id: idSchema,
});

export type AdministrativeUnitTable = v.InferOutput<
  typeof administrativeUnitSchema
> &
  GeneratedId;
