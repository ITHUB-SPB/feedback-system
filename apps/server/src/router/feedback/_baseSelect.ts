import { db, jsonObjectFrom } from "@shared/database";

export default function _baseSelect(databaseInstance: typeof db) {
  return databaseInstance
    .selectFrom("feedback")
    .selectAll()
    .innerJoin("project", "feedback.project_id", "project.id")
    .leftJoin(
      "administrative_unit",
      "project.administrative_unit_id",
      "administrative_unit.id",
    )
    .innerJoin("feedback_type", "feedback.feedback_type_id", "feedback_type.id")
    .leftJoin(
      "topic_category_topic",
      "feedback.topic_id",
      "topic_category_topic.id",
    )
    .leftJoin("topic", "topic.id", "topic_category_topic.topic_id")
    .leftJoin(
      "official_responsibility",
      "project.administrative_unit_id",
      "official_responsibility.administrative_unit_id",
    )
    .select(eb => [
      "feedback.id",
      "feedback.project_id",
      "feedback.description",
      "feedback.feedback_type_id",
      "feedback.topic_id",
      "feedback.person_id",
      "feedback.feedback_status_id",
      "feedback.feedback_status_comment",
      "feedback.created_at",
      "project.title as project",
      "administrative_unit.id as administrative_unit_id",
      "administrative_unit.title as administrative_unit_title",
      "feedback_type.title as feedback_type",
      "topic.title as topic",
      "official_responsibility.official_id as official_id",
      jsonObjectFrom(
        eb.selectFrom("feedback_status")
          .select(["feedback_status.id", "feedback_status.title", "feedback_status.translation"])
          .whereRef("feedback_status.id", "=", "feedback.feedback_status_id"),
      ).$notNull().as("status")
    ]);
}
