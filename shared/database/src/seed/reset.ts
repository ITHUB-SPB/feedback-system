import type { Kysely, TableExpression } from "kysely";
import type { Tables } from "../interface";

export default async function resetDatabase(db: Kysely<Tables>) {
  const tables = await db.introspection.getTables();
  for (const table of tables) {
    const tableName = table.name as TableExpression<Tables, never>;
    await db.deleteFrom(tableName).execute();
  }
}
