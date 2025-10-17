import { registerAs } from "@nestjs/config";
import { DataSourceOptions } from "typeorm";

export const databaseConfig = registerAs("database", (): DataSourceOptions => {
  const url = process.env.DATABASE_URL ?? "";
  return {
    type: "postgres",
    url,
    migrations: ["dist/src/migrations/*.js"],
    entities: ["dist/src/**/*.entity.js"],
  } as DataSourceOptions;
});
