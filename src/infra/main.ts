import { VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { EnvService } from "./env/env.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ["v1"],
    prefix: "api/",
  });

  app.enableCors();

  const envService = app.get(EnvService);

  const port = envService.get("PORT");

  await app.listen(port);
}

bootstrap();
