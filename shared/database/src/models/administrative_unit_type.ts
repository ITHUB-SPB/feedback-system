import * as v from "valibot";
import { idSchema, type GeneratedId } from "./_base";

export const administrativeUnitTypeSchema = v.object({
  id: idSchema,
  title: v.picklist(["town", "settlement"]),
});

export type AdministrativeUnitTypeTable = v.InferOutput<
  typeof administrativeUnitTypeSchema
> &
  GeneratedId;
