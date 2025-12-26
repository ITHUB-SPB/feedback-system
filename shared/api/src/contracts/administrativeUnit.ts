import { oc } from "@orpc/contract";
import * as v from "valibot";

import { administrativeUnitSchema } from "@shared/database/models/administrative_unit";
import { baseInputOne, baseInputAll } from "./_inputs";

const getAdministrativeUnitSchema = v.object({
  ...administrativeUnitSchema.entries,
  unit_type: v.string(),
});

const createAdministrativeUnitSchema = v.omit(administrativeUnitSchema, ["id"]);

const updateAdministrativeUnitSchema = v.object({
  params: baseInputOne,
  body: v.partial(createAdministrativeUnitSchema),
});

const getManyAdministrativeUnitSchema = v.array(getAdministrativeUnitSchema);

const administrativeUnitContract = oc
  .tag("Поселения")
  .prefix("/administrative_units")
  .router({
    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "Список всех поселений",
      })
      .input(baseInputAll)
      .output(getManyAdministrativeUnitSchema),

    one: oc
      .route({
        method: "GET",
        path: "/{id}",
        summary: "Информация по поселению",
      })
      .input(baseInputOne)
      .output(getAdministrativeUnitSchema),

    update: oc
      .route({
        method: "PATCH",
        path: "/{id}",
        inputStructure: "detailed",
        summary: "Обновление поселения",
      })
      .input(updateAdministrativeUnitSchema)
      .output(getAdministrativeUnitSchema),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "Создание поселения",
      })
      .input(createAdministrativeUnitSchema)
      .output(getAdministrativeUnitSchema),

    delete: oc
      .route({
        method: "DELETE",
        path: "/{id}",
        summary: "Удаление поселения",
      })
      .input(baseInputOne),
  });

export default administrativeUnitContract;
