import { AppDataSource } from "../data-source.js";

async function migrate() {
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();
  await AppDataSource.destroy();
}

migrate().catch((error) => {
  console.error("Migration failed", error);
  process.exit(1);
});
