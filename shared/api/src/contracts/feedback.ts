import * as v from "valibot";
import { oc } from "@orpc/contract";

import { feedbackSchema } from "@shared/database/models/feedback";
import { topicCategoryTopicSchema } from "@shared/database/models/topic_category_topic";
import { feedbackStatusTitleSchema } from "@shared/database/models/feedback_status";
import { userSchema } from "@shared/database/models/user";

import { baseInputAll, baseInputOne } from "./_inputs";

const getFeedbackSchema = v.object({
  ...feedbackSchema.entries,
  topic: v.nullable(v.string()),
  project: v.string(),
  administrative_unit_title: v.nullable(v.string()),
  administrative_unit_id: v.nullable(v.number()),
  official_id: v.nullable(v.string()),
  feedback_type: v.string(),
  feedback_status: feedbackStatusTitleSchema,
  image_links: v.optional(v.array(v.string()), []),
});

export const getOneFeedbackSchema = v.object({
  ...getFeedbackSchema.entries,
  person_full_name: v.string(),
  email: v.string(),
  person_phone: v.nullable(v.string()),
  responsible_person_full_name: v.nullable(v.string()),
});

const getManyAuthorizedFeedbackSchema = v.array(
  v.omit(getFeedbackSchema, ["image_links"]),
);

const getManyPublicFeedbackSchema = v.array(
  v.pick(getFeedbackSchema, [
    "description",
    "feedback_type",
    "feedback_status",
    "created_at",
  ]),
);

export const getManyFeedbackSchema = v.union([
  getManyAuthorizedFeedbackSchema,
  getManyPublicFeedbackSchema,
]);

export const updateFeedbackSchema = v.object({
  params: baseInputOne,
  body: v.partial(v.pick(feedbackSchema, ["feedback_status_id", "project_id"])),
});

export const createFeedbackSchema = v.object({
  project_id: v.pick(feedbackSchema, ["project_id"]),
  description: v.pick(feedbackSchema, ["description"]),
  feedback_type_id: v.pick(feedbackSchema, ["feedback_type_id"]),

  topic_category_topic_id: v.optional(v.pick(topicCategoryTopicSchema, ["id"])),

  first_name: v.pick(userSchema, ["firstName"]),
  last_name: v.pick(userSchema, ["lastName"]),
  middle_name: v.pick(userSchema, ["middleName"]),
  email: v.pick(userSchema, ["email"]),
  phone: v.pick(userSchema, ["phone"]),

  files: v.optional(
    v.union([
      v.array(
        v.pipe(v.file(), v.mimeType(["image/jpeg", "image/jpg", "image/png"])),
      ),
      v.pipe(v.file(), v.mimeType(["image/jpeg", "image/jpg", "image/png"])),
    ]),
  ),
});

const feedbackContract = oc
  .tag("Обращения")
  .prefix("/feedback")
  .router({
    all: oc
      .input(baseInputAll)
      .route({
        method: "GET",
        path: "/",
        summary: "Список обращений",
      })
      .output(getManyFeedbackSchema),

    one: oc
      .route({
        method: "GET",
        path: "/{id}",
        summary: "Информация об обращении",
      })
      .input(baseInputOne)
      .output(getOneFeedbackSchema),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "Создание обращения",
        inputStructure: "detailed",
        spec: (spec) => ({
          ...spec,
          operationId: "feedback.create",
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    project_id: {
                      type: "number",
                    },
                    description: {
                      type: "string",
                    },
                    topic_category_topic_id: {
                      type: "number",
                    },
                    feedback_type_id: {
                      type: "number",
                    },
                    first_name: {
                      type: "string",
                    },
                    last_name: {
                      type: "string",
                    },
                    middle_name: {
                      type: "string",
                    },
                    email: {
                      type: "string",
                    },
                    phone: {
                      type: "string",
                    },
                    files: {
                      type: "array",
                      items: {
                        type: "string",
                        contentMediaType: "image/*",
                      },
                    },
                  },
                  required: [
                    "project_id",
                    "description",
                    "feedback_type_id",
                    "first_name",
                    "last_name",
                    "middle_name",
                    "email",
                  ],
                },
              },
            },
          },
        }),
      })
      .input(
        v.object({
          body: createFeedbackSchema,
        }),
      ),

    update: oc
      .route({
        method: "PATCH",
        path: "/{id}",
        inputStructure: "detailed",
        summary: "Обновление обращения",
      })
      .input(updateFeedbackSchema)
      .output(getOneFeedbackSchema),
  });

export default feedbackContract;
