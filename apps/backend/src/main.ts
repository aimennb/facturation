import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { json, urlencoded } from "express";

import { AppModule } from "./app.module.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);

  app.setGlobalPrefix("api");
  app.enableVersioning();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.use(urlencoded({ extended: true }));
  app.use(json({ limit: "10mb" }));

  const port = configService.get("PORT", 4000);
  await app.listen(port);
  return port;
}

bootstrap()
  .then((port) => {
    console.log(`Backend listening on http://localhost:${port}`);
  })
  .catch((err) => {
    console.error("Failed to start backend", err);
    process.exit(1);
  });
