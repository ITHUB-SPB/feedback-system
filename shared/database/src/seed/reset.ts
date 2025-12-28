import type { Kysely, TableExpression, TableMetadata } from "kysely";
import type { Tables } from "../interface";

function withoutExternal(tables: TableMetadata[]) {
  const AUTH_TABLES = ["user", "session", "account"]
  return tables
    .filter(table => !(AUTH_TABLES.includes(table.name)))
    .filter(table => !(table.name.includes("sidequest")))
}

export async function resetDatabase(db: Kysely<Tables>) {
  const tables = await db.introspection.getTables();
  for (const table of withoutExternal(tables)) {
    await db.schema.dropTable(table.name).cascade().execute()
  }
}

export async function resetTables(db: Kysely<Tables>) {
  const tables = await db.introspection.getTables();
  for (const table of withoutExternal(tables)) {
    const tableName = table.name as TableExpression<Tables, never>;
    await db.deleteFrom(tableName).execute();
  }
}
