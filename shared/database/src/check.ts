import { db } from "./connection";

async function checkConnection() {
  return await db.introspection.getTables();
}

checkConnection()
  .then((meta) => {
    console.log(`Connection for postgres OK`);
    console.log(meta.map(({ name }) => name).join(", "));
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
