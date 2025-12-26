/**
 * TODO
 *
 * Переработать модель:
 *
 * - id
 * - administrative_unit_id (FK)
 * - voting_title (именование для пользователей)
 *
 * Убрать дублирование данных с иными таблицами
 */

import { oc } from "@orpc/contract";
import * as v from "valibot";

import { votingUnitSchema } from "@shared/database/models/voting_unit";
import { baseInputOne, baseInputAll } from "./_inputs";

export const getVotingUnitSchema = v.object({
  ...votingUnitSchema.entries,
  voting_region: v.string(),
});

export const createVotingUnitSchema = v.omit(votingUnitSchema, ["id"]);
export const updateVotingUnitSchema = v.object({
  params: baseInputOne,
  body: v.partial(createVotingUnitSchema),
});

const votingUnitContract = oc
  .tag("Голосующие поселения")
  .prefix("/voting_units")
  .router({
    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "Список всех голосующих поселений",
      })
      .input(baseInputAll)
      .output(v.array(getVotingUnitSchema)),

    one: oc
      .route({
        method: "GET",
        path: "/{id}",
        summary: "Информация о голосующем поселении",
      })
      .input(baseInputOne)
      .output(getVotingUnitSchema),

    update: oc
      .route({
        method: "PATCH",
        path: "/{id}",
        inputStructure: "detailed",
        summary: "Обновление информации о голосующем поселении",
      })
      .input(updateVotingUnitSchema)
      .output(getVotingUnitSchema),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "Добавление голосующего поселения",
      })
      .input(createVotingUnitSchema)
      .output(getVotingUnitSchema),

    delete: oc
      .route({
        method: "DELETE",
        path: "/{id}",
        summary: "Удаление голосующего поселения",
      })
      .input(baseInputOne),
  });

export default votingUnitContract;
