import { oc } from "@orpc/contract";
import * as v from "valibot";

import { administrativeUnitTypeSchema } from "@shared/database/models/administrative_unit_type";

const administrativeUnitTypeContract = oc
  .tag("Поселения")
  .prefix("/administrative_unit_types")
  .router({
    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "Список типов поселений",
      })
      .output(v.array(administrativeUnitTypeSchema)),
  });

export default administrativeUnitTypeContract;
