import { sql } from "kysely";
import { db } from "./index";
import { resetDatabase } from "./seed/reset";

async function migratePostgres() {
  await resetDatabase(db)

  await db.schema
    .createTable("administrative_unit_type")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("title", "text", (col) => col.notNull().unique())
    .execute();

  await db.schema
    .createTable("administrative_unit")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("title", "text", (col) => col.notNull().unique())
    .addColumn("unit_type_id", "integer", (col) =>
      col.references("administrative_unit_type.id").onDelete("set null"),
    )
    .execute();

  await db.schema
    .createTable("project")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("latitude", "float8", (col) => col.notNull())
    .addColumn("longitude", "float8", (col) => col.notNull())
    .addColumn("year_of_completion", "integer", (col) => col.notNull())
    .addColumn("administrative_unit_id", "integer", (col) =>
      col.references("administrative_unit.id").onDelete("set null"),
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute();

  await db.schema
    .createTable("topic")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("title", "text", (col) => col.notNull().unique())
    .execute();

  await db.schema
    .createTable("topic_category")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("title", "text", (col) => col.notNull().unique())
    .execute();

  await db.schema
    .createTable("topic_category_topic")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("topic_id", "integer", (col) =>
      col.references("topic.id").notNull().onDelete("cascade"),
    )
    .addColumn("topic_category_id", "integer", (col) =>
      col.references("topic_category.id").notNull().onDelete("cascade"),
    )
    .execute();

  await db.schema
    .createTable("feedback_type")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("title", "text", (col) => col.notNull().unique())
    .execute();

  await db.schema
    .createTable("feedback_status")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("title", "text", (col) => col.notNull().unique())
    .addColumn("translation", "text", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("official_responsibility")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("administrative_unit_id", "integer", (col) =>
      col.references("administrative_unit.id").notNull().onDelete("cascade"),
    )
    .addColumn("official_id", "text", (col) =>
      col.notNull().references("user.id").onDelete("cascade"),
    )
    .execute();

  await db.schema
    .createTable("feedback")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("project_id", "integer", (col) =>
      col.references("project.id").onDelete("cascade").notNull(),
    )
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("feedback_type_id", "integer", (col) =>
      col.references("feedback_type.id").onDelete("set null"),
    )
    .addColumn("topic_id", "integer", (col) =>
      col.references("topic_category_topic.id").onDelete("set null"),
    )
    .addColumn("person_id", "text", (col) =>
      col.references("user.id").onDelete("set null"),
    )
    .addColumn("feedback_status_id", "integer", (col) =>
      col.references("feedback_status.id").onDelete("set null"),
    )
    .addColumn("feedback_status_comment", "text")
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute();

  await db.schema
    .createTable("feedback_image")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("feedback_id", "integer", (col) =>
      col.notNull().references("feedback.id").onDelete("cascade"),
    )
    .addColumn("link_to_s3", "text", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("voting_region")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("title", "text", (col) => col.notNull().unique())
    .execute();

  await db.schema
    .createTable("voting_unit")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("voting_region_id", "integer", (col) =>
      col.references("voting_region.id").onDelete("set null"),
    )
    .addUniqueConstraint("voting_unit_title_region_pain_unique", [
      "title",
      "voting_region_id",
    ])
    .execute();

  await db.schema
    .createTable("voting_vote")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("voting_unit_id", "integer", (col) =>
      col.notNull().references("voting_unit.id").onDelete("set null"),
    )
    .addColumn("username", "text", (col) => col.notNull().unique())
    .addColumn("description", "text", (col) => col.notNull().unique())
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute();

  console.log("база данных успешно создана! :D");
  process.exit(0);
}

migratePostgres().catch((error) => {
  console.error(error);
  process.exit(1);
});
