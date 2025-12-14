import { db } from "./index";
import { parseEnv } from "./env";

async function checkConnection() {
  return await db.introspection.getTables();
}

checkConnection()
  .then((meta) => {
    const env = parseEnv();
    const checkDatabase = env.ENV === "development" ? "pglite" : "postgres";

    console.log(`Connection for ${checkDatabase} OK`);
    console.log(meta.map(({ name }) => name).join(", "));
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
